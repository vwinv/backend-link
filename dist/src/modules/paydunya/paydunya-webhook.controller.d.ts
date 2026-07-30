import { SubscriptionsService } from '../subscriptions/subscriptions.service';
export declare class PaydunyaWebhookController {
    private readonly subscriptionsService;
    private readonly logger;
    constructor(subscriptionsService: SubscriptionsService);
    handle(body: Record<string, unknown>): Promise<{
        ok: false;
        error: string;
        ignored?: undefined;
        status?: undefined;
        alreadyProcessed?: undefined;
    } | {
        ok: true;
        ignored: true;
        status: string;
        error?: undefined;
        alreadyProcessed?: undefined;
    } | {
        ok: true;
        alreadyProcessed: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
    } | {
        ok: true;
        error?: undefined;
        ignored?: undefined;
        status?: undefined;
        alreadyProcessed?: undefined;
    }>;
}
