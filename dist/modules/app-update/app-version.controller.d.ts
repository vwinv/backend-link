import { AppUpdateService } from './app-update.service';
export declare class AppVersionController {
    private readonly appUpdateService;
    constructor(appUpdateService: AppUpdateService);
    getVersion(): Promise<import("./app-update.service").AppUpdateConfigDto>;
}
