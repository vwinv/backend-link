"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PushProgramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushProgramService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const free_offer_constants_1 = require("../subscriptions/free-offer.constants");
const subscription_validity_1 = require("../subscriptions/subscription-validity");
const notifications_service_1 = require("./notifications.service");
const push_program_catalog_1 = require("./push-program.catalog");
let PushProgramService = PushProgramService_1 = class PushProgramService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(PushProgramService_1.name);
    running = false;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async touchLastOpened(userId, timezone) {
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
    async runScheduledTick(now = new Date()) {
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
            if (userIds.length === 0)
                return { scanned: 0, sent: 0 };
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
                    if (didSend)
                        sent += 1;
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    this.logger.warn(`Push programme: échec user ${user.id}: ${message}`);
                }
            }
            if (sent > 0) {
                this.logger.log(`Push programme: ${sent}/${scanned} notification(s) envoyée(s)`);
            }
            return { scanned, sent };
        }
        finally {
            this.running = false;
        }
    }
    async evaluateUser(user, now) {
        const clock = this.localClock(now, user.timezone);
        if (clock.hour < push_program_catalog_1.PUSH_SEND_WINDOW.startHour ||
            clock.hour >= push_program_catalog_1.PUSH_SEND_WINDOW.endHour) {
            return false;
        }
        const alreadyToday = await this.prisma.pushProgramDelivery.findFirst({
            where: { userId: user.id, localDate: clock.localDate },
            select: { id: true },
        });
        if (alreadyToday)
            return false;
        const lastOpened = user.lastOpenedAt ?? user.createdAt;
        const openedWithin24h = now.getTime() - lastOpened.getTime() < 24 * 60 * 60 * 1000;
        const inactiveDays = Math.floor((now.getTime() - lastOpened.getTime()) / (24 * 60 * 60 * 1000));
        const daysSinceSignup = Math.floor((now.getTime() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000));
        const candidates = [];
        if (await this.hasPendingCardViewNotify(user.id, now)) {
            candidates.push(this.candidate(20));
        }
        if (!openedWithin24h) {
            const inactivity = this.matchInactivity(inactiveDays, clock);
            if (inactivity) {
                candidates.push(inactivity);
            }
            else if (!this.isInactivityReservedDay(inactiveDays)) {
                const isPremium = await this.isPremiumUser(user.id);
                if (!isPremium) {
                    const onboarding = await this.matchOnboarding(user.id, daysSinceSignup, user.createdAt, clock);
                    if (onboarding)
                        candidates.push(onboarding);
                }
                if (inactiveDays < 3) {
                    const calendar = this.matchCalendar(clock);
                    if (calendar)
                        candidates.push(calendar);
                }
            }
        }
        if (candidates.length === 0)
            return false;
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
    candidate(messageNumber) {
        const family = (0, push_program_catalog_1.familyForMessage)(messageNumber);
        return {
            messageNumber,
            family,
            priority: (0, push_program_catalog_1.priorityForFamily)(family),
        };
    }
    isInactivityReservedDay(inactiveDays) {
        if (inactiveDays >= 15 && inactiveDays <= 30)
            return true;
        return push_program_catalog_1.INACTIVITY_SCHEDULE.some((row) => row.days === inactiveDays);
    }
    matchInactivity(inactiveDays, clock) {
        if (inactiveDays < 2 || inactiveDays > 30)
            return null;
        const exact = push_program_catalog_1.INACTIVITY_SCHEDULE.find((row) => row.days === inactiveDays);
        if (exact) {
            if (!this.isAtLocalTime(clock, exact.hour, exact.minute))
                return null;
            return this.candidate(exact.messageNumber);
        }
        if (inactiveDays >= 15 && inactiveDays <= 30) {
            if (!this.isAtLocalTime(clock, 18, 0))
                return null;
            const index = this.isoWeekNumber(clock.year, clock.month, clock.day) %
                push_program_catalog_1.INACTIVITY_WEEKLY_ROTATION.length;
            return this.candidate(push_program_catalog_1.INACTIVITY_WEEKLY_ROTATION[index]);
        }
        return null;
    }
    matchCalendar(clock) {
        if (clock.weekday === 1) {
            if (!this.isAtLocalTime(clock, 8, 30))
                return null;
            return this.candidate(16);
        }
        if (clock.weekday === 3) {
            if (!this.isAtLocalTime(clock, 12, 30))
                return null;
            const index = this.isoWeekNumber(clock.year, clock.month, clock.day) %
                push_program_catalog_1.WEDNESDAY_ROTATION.length;
            return this.candidate(push_program_catalog_1.WEDNESDAY_ROTATION[index]);
        }
        if (clock.weekday === 5) {
            if (!this.isAtLocalTime(clock, 17, 0))
                return null;
            return this.candidate(17);
        }
        if (clock.weekday === 7) {
            if (!this.isAtLocalTime(clock, 19, 30))
                return null;
            return this.candidate(18);
        }
        return null;
    }
    async matchOnboarding(userId, daysSinceSignup, createdAt, clock) {
        const options = [];
        if (daysSinceSignup === 1 && this.isAtLocalTime(clock, 12, 30)) {
            const shared = await this.hasSharedAnyCard(userId);
            if (!shared)
                options.push(this.candidate(11));
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
        if (daysSinceSignup > 21 &&
            this.isAtLocalTime(clock, 18, 0) &&
            this.isMonthlyAnniversary(createdAt, clock)) {
            const monthIndex = (clock.year * 12 + clock.month) % push_program_catalog_1.PREMIUM_MONTHLY_ROTATION.length;
            options.push(this.candidate(push_program_catalog_1.PREMIUM_MONTHLY_ROTATION[monthIndex]));
        }
        if (this.isAtLocalTime(clock, 12, 30)) {
            const needsPhoto = await this.needsProfilePhotoReminder(userId);
            if (needsPhoto)
                options.push(this.candidate(12));
        }
        if (options.length === 0)
            return null;
        options.sort((a, b) => a.messageNumber - b.messageNumber);
        return options[0];
    }
    async passesRotation(userId, candidate, clock) {
        const sameWeek = await this.prisma.pushProgramDelivery.findFirst({
            where: {
                userId,
                messageNumber: candidate.messageNumber,
                weekKey: clock.weekKey,
            },
            select: { id: true },
        });
        if (sameWeek)
            return false;
        if (candidate.messageNumber === 12) {
            const sameMonth = await this.prisma.pushProgramDelivery.findFirst({
                where: {
                    userId,
                    messageNumber: 12,
                    monthKey: clock.monthKey,
                },
                select: { id: true },
            });
            if (sameMonth)
                return false;
        }
        if (candidate.family === 'inactivity' &&
            candidate.messageNumber >= 1 &&
            candidate.messageNumber <= 6) {
            const inactiveWeek = await this.prisma.pushProgramDelivery.findFirst({
                where: {
                    userId,
                    family: 'inactivity',
                    weekKey: clock.weekKey,
                },
                select: { id: true },
            });
            if (inactiveWeek) {
                const days = await this.inactiveDaysForUser(userId);
                if (days != null && days >= 15)
                    return false;
            }
        }
        return true;
    }
    async inactiveDaysForUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { lastOpenedAt: true, createdAt: true },
        });
        if (!user)
            return null;
        const last = user.lastOpenedAt ?? user.createdAt;
        return Math.floor((Date.now() - last.getTime()) / (24 * 60 * 60 * 1000));
    }
    async deliver(userId, candidate, clock) {
        const body = (0, push_program_catalog_1.getPushProgramBody)(candidate.messageNumber);
        if (!body)
            return;
        await this.notificationsService.notifyUser({
            userId,
            title: push_program_catalog_1.PUSH_PROGRAM_TITLE,
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
    async hasPendingCardViewNotify(userId, now) {
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
    async isPremiumUser(userId) {
        const sub = await this.prisma.subscription.findFirst({
            where: (0, subscription_validity_1.validSubscriptionWhere)({
                userId,
                ...(0, subscription_validity_1.sameSubscriptionFamilyWhere)(client_1.OfferAudience.PERSONAL),
            }),
            select: {
                offer: { select: { slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const slug = sub?.offer?.slug?.trim();
        return !!slug && slug !== free_offer_constants_1.FREE_OFFER_SLUG;
    }
    async hasSharedAnyCard(userId) {
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
    async needsProfilePhotoReminder(userId) {
        const card = await this.prisma.businessCard.findFirst({
            where: { ownerId: userId, isActive: true },
            orderBy: { createdAt: 'asc' },
            select: { avatarUrl: true, updatedAt: true },
        });
        if (!card)
            return false;
        const avatar = card.avatarUrl?.trim();
        if (!avatar)
            return true;
        const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
        return Date.now() - card.updatedAt.getTime() > threeMonthsMs;
    }
    isMonthlyAnniversary(createdAt, clock) {
        const created = this.localClock(createdAt, clock.timeZone);
        if (created.day === clock.day)
            return true;
        const daysInMonth = this.daysInMonth(clock.year, clock.month);
        return created.day > daysInMonth && clock.day === daysInMonth;
    }
    isAtLocalTime(clock, hour, minute) {
        const target = hour * 60 + minute;
        const delta = clock.minutesOfDay - target;
        return delta >= 0 && delta <= push_program_catalog_1.PUSH_HOUR_TOLERANCE_MINUTES;
    }
    normalizeTimezone(value) {
        const tz = value?.trim();
        if (!tz)
            return null;
        try {
            Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date());
            return tz;
        }
        catch {
            return push_program_catalog_1.DEFAULT_PUSH_TIMEZONE;
        }
    }
    localClock(date, timeZoneRaw) {
        const timeZone = this.normalizeTimezone(timeZoneRaw) ?? push_program_catalog_1.DEFAULT_PUSH_TIMEZONE;
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
        const get = (type) => parts.find((part) => part.type === type)?.value ?? '';
        const year = Number(get('year'));
        const month = Number(get('month'));
        const day = Number(get('day'));
        const hour = Number(get('hour'));
        const minute = Number(get('minute'));
        const weekdayToken = get('weekday').toLowerCase();
        const weekdayMap = {
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
    isoWeekNumber(year, month, day) {
        const utc = new Date(Date.UTC(year, month - 1, day));
        const dayNum = utc.getUTCDay() || 7;
        utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
        return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    }
    daysInMonth(year, month) {
        return new Date(Date.UTC(year, month, 0)).getUTCDate();
    }
};
exports.PushProgramService = PushProgramService;
exports.PushProgramService = PushProgramService = PushProgramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PushProgramService);
//# sourceMappingURL=push-program.service.js.map