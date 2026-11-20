import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
export declare class PushProgramService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly logger;
    private running;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    touchLastOpened(userId: string, timezone?: string | null): Promise<{
        id: string;
        timezone: string;
        lastOpenedAt: Date | null;
    }>;
    runScheduledTick(now?: Date): Promise<{
        scanned: number;
        sent: number;
    }>;
    private evaluateUser;
    private candidate;
    private isInactivityReservedDay;
    private matchInactivity;
    private matchCalendar;
    private matchOnboarding;
    private passesRotation;
    private inactiveDaysForUser;
    private deliver;
    private hasPendingCardViewNotify;
    private isPremiumUser;
    private hasSharedAnyCard;
    private needsProfilePhotoReminder;
    private isMonthlyAnniversary;
    private isAtLocalTime;
    private normalizeTimezone;
    private localClock;
    private isoWeekNumber;
    private daysInMonth;
}
