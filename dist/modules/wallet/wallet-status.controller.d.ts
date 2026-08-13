import type { Response } from 'express';
import { AppleWalletService } from './apple-wallet.service';
import { WalletConfig } from './wallet.config';
export declare class WalletStatusController {
    private readonly walletConfig;
    private readonly appleWalletService;
    constructor(walletConfig: WalletConfig, appleWalletService: AppleWalletService);
    status(): Record<string, unknown>;
    selfTest(): Promise<Record<string, unknown>>;
    selfTestPkpass(res: Response): Promise<void>;
}
