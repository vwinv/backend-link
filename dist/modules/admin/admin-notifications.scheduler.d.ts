import { AdminNotificationsService } from './admin-notifications.service';
export declare class AdminNotificationsScheduler {
    private readonly notificationsService;
    private readonly logger;
    constructor(notificationsService: AdminNotificationsService);
    tick(): Promise<void>;
}
