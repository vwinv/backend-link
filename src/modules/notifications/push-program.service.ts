import { Injectable, Logger } from '@nestjs/common';
import { OfferAudience } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FREE_OFFER_SLUG } from '../subscriptions/free-offer.constants';
import {
  sameSubscriptionFamilyWhere,
  validSubscriptionWhere,
} from '../subscriptions/subscription-validity';
import { NotificationsService } from './notifications.service';
import {
  DEFAULT_PUSH_TIMEZONE,
  INACTIVITY_SCHEDULE,
  INACTIVITY_WEEKLY_ROTATION,
  PREMIUM_MONTHLY_ROTATION,
  PUSH_HOUR_TOLERANCE_MINUTES,
  PUSH_PROGRAM_TITLE,
  PUSH_SEND_WINDOW,
  WEDNESDAY_ROTATION,
  familyForMessage,
  getPushProgramBody,
  priorityForFamily,
  type PushProgramFamily,
} from './push-program.catalog';

type LocalClock = {
  date: Date;
  timeZone: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number; // 1=Mon … 7=Sun (ISO)
  localDate: string;
  weekKey: string;
  monthKey: string;
  minutesOfDay: number;
};

type Candidate = {
  messageNumber: number;
  family: PushProgramFamily;
  priority: 1 | 2 | 3 | 4;
};

@Injectable()
export class PushProgramService {
  private readonly logger = new Logger(PushProgramService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async touchLastOpened(userId: string, timezone?: string | null) {
    const tz = this.normalizeTimezone(timezone);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lastOpenedAt: new Date(),
        ...(tz ? { timezone: tz } : {}),
      },
      select: { id: true, lastOpenedAt: true, timezone: true },
    });
  }

  /** Cron : évalue tous les users avec token push. */
  async runScheduledTick(now = new Date()): Promise<{
    scanned: number;
    sent: number;
  }> {
    if (this.running) {
      return { scanned: 0, sent: 0 };
    }
    this.running = true;
    let scanned = 0;
    let sent = 0;
    try {
      const tokenRows = await this.prisma.devicePushToken.findMany({
        select: { userId: true },
        distinct: ['userId'],
      });
      const userIds = tokenRows.map((row) => row.userId);
      if (userIds.length === 0) return { scanned: 0, sent: 0 };

      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds }, isActive: true },
        select: {
          id: true,
          createdAt: true,
          lastOpenedAt: true,
          timezone: true,
          preferredLocale: true,
        },
      });

      for (const user of users) {
        scanned += 1;
        try {
          const didSend = await this.evaluateUser(user, now);
          if (didSend) sent += 1;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `Push programme: échec user ${user.id}: ${message}`,
          );
        }
      }

      if (sent > 0) {
        this.logger.log(
          `Push programme: ${sent}/${scanned} notification(s) envoyée(s)`,
        );
      }
      return { scanned, sent };
    } finally {
      this.running = false;
    }
  }

  private async evaluateUser(
    user: {
      id: string;
      createdAt: Date;
      lastOpenedAt: Date | null;
      timezone: string;
      preferredLocale: string;
    },
    now: Date,
  ): Promise<boolean> {
    const clock = this.localClock(now, user.timezone);
    if (
      clock.hour < PUSH_SEND_WINDOW.startHour ||
      clock.hour >= PUSH_SEND_WINDOW.endHour
    ) {
      return false;
    }

    const alreadyToday = await this.prisma.pushProgramDelivery.findFirst({
      where: { userId: user.id, localDate: clock.localDate },
      select: { id: true },
    });
    if (alreadyToday) return false;

    const lastOpened = user.lastOpenedAt ?? user.createdAt;
    const openedWithin24h =
      now.getTime() - lastOpened.getTime() < 24 * 60 * 60 * 1000;
    const inactiveDays = Math.floor(
      (now.getTime() - lastOpened.getTime()) / (24 * 60 * 60 * 1000),
    );
    const daysSinceSignup = Math.floor(
      (now.getTime() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000),
    );

    const candidates: Candidate[] = [];

    if (await this.hasPendingCardViewNotify(user.id, now)) {
      candidates.push(this.candidate(20));
    }

    if (!openedWithin24h) {
      const inactivity = this.matchInactivity(inactiveDays, clock);
      if (inactivity) {
        candidates.push(inactivity);
      } else if (!this.isInactivityReservedDay(inactiveDays)) {
        // Jour sans palier inactivité → onboarding / calendrier possibles.
        const isPremium = await this.isPremiumUser(user.id);
        if (!isPremium) {
          const onboarding = await this.matchOnboarding(
            user.id,
            daysSinceSignup,
            user.createdAt,
            clock,
          );
          if (onboarding) candidates.push(onboarding);
        }

        if (inactiveDays < 3) {
          const calendar = this.matchCalendar(clock);
          if (calendar) candidates.push(calendar);
        }
      }
      // Sinon : jour réservé à l’inactivité (pas encore l’heure) → attendre.
    }

    if (candidates.length === 0) return false;

    candidates.sort((a, b) => a.priority - b.priority || a.messageNumber - b.messageNumber);

    for (const candidate of candidates) {
      if (!(await this.passesRotation(user.id, candidate, clock))) {
        continue;
      }
      await this.deliver(user.id, candidate, clock);
      return true;
    }
    return false;
  }

  private candidate(messageNumber: number): Candidate {
    const family = familyForMessage(messageNumber);
    return {
      messageNumber,
      family,
      priority: priorityForFamily(family),
    };
  }

  /** Jours où seule l’inactivité (ou N°20) peut partir. */
  private isInactivityReservedDay(inactiveDays: number): boolean {
    if (inactiveDays >= 15 && inactiveDays <= 30) return true;
    return INACTIVITY_SCHEDULE.some((row) => row.days === inactiveDays);
  }

  private matchInactivity(
    inactiveDays: number,
    clock: LocalClock,
  ): Candidate | null {
    if (inactiveDays < 2 || inactiveDays > 30) return null;

    const exact = INACTIVITY_SCHEDULE.find((row) => row.days === inactiveDays);
    if (exact) {
      if (!this.isAtLocalTime(clock, exact.hour, exact.minute)) return null;
      return this.candidate(exact.messageNumber);
    }

    if (inactiveDays >= 15 && inactiveDays <= 30) {
      if (!this.isAtLocalTime(clock, 18, 0)) return null;
      const index =
        this.isoWeekNumber(clock.year, clock.month, clock.day) %
        INACTIVITY_WEEKLY_ROTATION.length;
      return this.candidate(INACTIVITY_WEEKLY_ROTATION[index]!);
    }

    return null;
  }

  private matchCalendar(clock: LocalClock): Candidate | null {
    // ISO weekday: 1 Mon … 7 Sun
    if (clock.weekday === 1) {
      if (!this.isAtLocalTime(clock, 8, 30)) return null;
      return this.candidate(16);
    }
    if (clock.weekday === 3) {
      if (!this.isAtLocalTime(clock, 12, 30)) return null;
      const index =
        this.isoWeekNumber(clock.year, clock.month, clock.day) %
        WEDNESDAY_ROTATION.length;
      return this.candidate(WEDNESDAY_ROTATION[index]!);
    }
    if (clock.weekday === 5) {
      if (!this.isAtLocalTime(clock, 17, 0)) return null;
      return this.candidate(17);
    }
    if (clock.weekday === 7) {
      if (!this.isAtLocalTime(clock, 19, 30)) return null;
      return this.candidate(18);
    }
    return null;
  }

  private async matchOnboarding(
    userId: string,
    daysSinceSignup: number,
    createdAt: Date,
    clock: LocalClock,
  ): Promise<Candidate | null> {
    const options: Candidate[] = [];

    if (daysSinceSignup === 1 && this.isAtLocalTime(clock, 12, 30)) {
      const shared = await this.hasSharedAnyCard(userId);
      if (!shared) options.push(this.candidate(11));
    }

    if (daysSinceSignup === 7 && this.isAtLocalTime(clock, 18, 0)) {
      options.push(this.candidate(13));
    }
    if (daysSinceSignup === 14 && this.isAtLocalTime(clock, 18, 0)) {
      options.push(this.candidate(14));
    }
    if (daysSinceSignup === 21 && this.isAtLocalTime(clock, 18, 0)) {
      options.push(this.candidate(15));
    }

    if (
      daysSinceSignup > 21 &&
      this.isAtLocalTime(clock, 18, 0) &&
      this.isMonthlyAnniversary(createdAt, clock)
    ) {
      const monthIndex =
        (clock.year * 12 + clock.month) % PREMIUM_MONTHLY_ROTATION.length;
      options.push(this.candidate(PREMIUM_MONTHLY_ROTATION[monthIndex]!));
    }

    if (this.isAtLocalTime(clock, 12, 30)) {
      const needsPhoto = await this.needsProfilePhotoReminder(userId);
      if (needsPhoto) options.push(this.candidate(12));
    }

    if (options.length === 0) return null;
    options.sort((a, b) => a.messageNumber - b.messageNumber);
    return options[0]!;
  }

  private async passesRotation(
    userId: string,
    candidate: Candidate,
    clock: LocalClock,
  ): Promise<boolean> {
    const sameWeek = await this.prisma.pushProgramDelivery.findFirst({
      where: {
        userId,
        messageNumber: candidate.messageNumber,
        weekKey: clock.weekKey,
      },
      select: { id: true },
    });
    if (sameWeek) return false;

    if (candidate.messageNumber === 12) {
      const sameMonth = await this.prisma.pushProgramDelivery.findFirst({
        where: {
          userId,
          messageNumber: 12,
          monthKey: clock.monthKey,
        },
        select: { id: true },
      });
      if (sameMonth) return false;
    }

    if (
      candidate.family === 'inactivity' &&
      candidate.messageNumber >= 1 &&
      candidate.messageNumber <= 6
    ) {
      // 15–30 j : max 1 relance inactivité / semaine
      const inactiveWeek = await this.prisma.pushProgramDelivery.findFirst({
        where: {
          userId,
          family: 'inactivity',
          weekKey: clock.weekKey,
        },
        select: { id: true },
      });
      // Les paliers exacts (2/3/5…) peuvent coexister dans une semaine
      // différente ; si on est en mode hebdo (15–30), bloquer un 2e envoi semaine.
      if (inactiveWeek) {
        const days = await this.inactiveDaysForUser(userId);
        if (days != null && days >= 15) return false;
      }
    }

    return true;
  }

  private async inactiveDaysForUser(userId: string): Promise<number | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastOpenedAt: true, createdAt: true },
    });
    if (!user) return null;
    const last = user.lastOpenedAt ?? user.createdAt;
    return Math.floor(
      (Date.now() - last.getTime()) / (24 * 60 * 60 * 1000),
    );
  }

  private async deliver(
    userId: string,
    candidate: Candidate,
    clock: LocalClock,
  ) {
    const body = getPushProgramBody(candidate.messageNumber);
    if (!body) return;

    await this.notificationsService.notifyUser({
      userId,
      title: PUSH_PROGRAM_TITLE,
      body,
      data: {
        type: 'push_program',
        messageNumber: String(candidate.messageNumber),
        family: candidate.family,
      },
    });

    await this.prisma.pushProgramDelivery.create({
      data: {
        userId,
        messageNumber: candidate.messageNumber,
        family: candidate.family,
        localDate: clock.localDate,
        weekKey: clock.weekKey,
        monthKey: clock.monthKey,
      },
    });
  }

  private async hasPendingCardViewNotify(
    userId: string,
    now: Date,
  ): Promise<boolean> {
    const minAgeMs = 15 * 60 * 1000;
    const maxAgeMs = 24 * 60 * 60 * 1000;
    const oldest = new Date(now.getTime() - maxAgeMs);
    const newest = new Date(now.getTime() - minAgeMs);

    const view = await this.prisma.cardView.findFirst({
      where: {
        viewedAt: { gte: oldest, lte: newest },
        card: { ownerId: userId },
        OR: [
          { viewerUserId: null },
          { viewerUserId: { not: userId } },
        ],
      },
      select: { id: true },
      orderBy: { viewedAt: 'desc' },
    });
    return view != null;
  }

  private async isPremiumUser(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findFirst({
      where: validSubscriptionWhere({
        userId,
        ...sameSubscriptionFamilyWhere(OfferAudience.PERSONAL),
      }),
      select: {
        offer: { select: { slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const slug = sub?.offer?.slug?.trim();
    return !!slug && slug !== FREE_OFFER_SLUG;
  }

  private async hasSharedAnyCard(userId: string): Promise<boolean> {
    const share = await this.prisma.shareEvent.findFirst({
      where: {
        OR: [
          { userId },
          { card: { ownerId: userId } },
        ],
      },
      select: { id: true },
    });
    return share != null;
  }

  private async needsProfilePhotoReminder(userId: string): Promise<boolean> {
    const card = await this.prisma.businessCard.findFirst({
      where: { ownerId: userId, isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { avatarUrl: true, updatedAt: true },
    });
    if (!card) return false;
    const avatar = card.avatarUrl?.trim();
    if (!avatar) return true;
    const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
    return Date.now() - card.updatedAt.getTime() > threeMonthsMs;
  }

  private isMonthlyAnniversary(createdAt: Date, clock: LocalClock): boolean {
    const created = this.localClock(createdAt, clock.timeZone);
    if (created.day === clock.day) return true;
    // Fin de mois : si inscrit le 31 et mois courant plus court
    const daysInMonth = this.daysInMonth(clock.year, clock.month);
    return created.day > daysInMonth && clock.day === daysInMonth;
  }

  private isAtLocalTime(
    clock: LocalClock,
    hour: number,
    minute: number,
  ): boolean {
    const target = hour * 60 + minute;
    const delta = clock.minutesOfDay - target;
    return delta >= 0 && delta <= PUSH_HOUR_TOLERANCE_MINUTES;
  }

  private normalizeTimezone(value?: string | null): string | null {
    const tz = value?.trim();
    if (!tz) return null;
    try {
      Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date());
      return tz;
    } catch {
      return DEFAULT_PUSH_TIMEZONE;
    }
  }

  private localClock(date: Date, timeZoneRaw?: string | null): LocalClock {
    const timeZone =
      this.normalizeTimezone(timeZoneRaw) ?? DEFAULT_PUSH_TIMEZONE;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    }).formatToParts(date);

    const get = (type: string) =>
      parts.find((part) => part.type === type)?.value ?? '';

    const year = Number(get('year'));
    const month = Number(get('month'));
    const day = Number(get('day'));
    const hour = Number(get('hour'));
    const minute = Number(get('minute'));
    const weekdayToken = get('weekday').toLowerCase();
    const weekdayMap: Record<string, number> = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 7,
    };
    const weekday = weekdayMap[weekdayToken.slice(0, 3)] ?? 1;
    const week = this.isoWeekNumber(year, month, day);

    return {
      date,
      timeZone,
      year,
      month,
      day,
      hour,
      minute,
      weekday,
      localDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      weekKey: `${year}-W${String(week).padStart(2, '0')}`,
      monthKey: `${year}-${String(month).padStart(2, '0')}`,
      minutesOfDay: hour * 60 + minute,
    };
  }

  private isoWeekNumber(year: number, month: number, day: number): number {
    const utc = new Date(Date.UTC(year, month - 1, day));
    const dayNum = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }
}
