import { SaveToWalletDto } from './dto/save-to-wallet.dto';
import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    addCardToWallet(user: {
        userId: string;
    }, cardId: string, dto: SaveToWalletDto): Promise<{
        walletType: "APPLE_WALLET";
        savedCardId: string;
        passBase64: string;
        saveUrl?: undefined;
    } | {
        walletType: "GOOGLE_WALLET";
        savedCardId: string;
        saveUrl: string;
        passBase64?: undefined;
    }>;
    findAll(user: {
        userId: string;
    }): Promise<({
        card: {
            id: string;
            firstName: string;
            lastName: string;
            slug: string;
            jobTitle: string | null;
            company: string | null;
        };
    } & {
        id: string;
        userId: string;
        cardId: string;
        walletType: import(".prisma/client").$Enums.WalletType;
        passId: string | null;
        savedAt: Date;
    })[]>;
    remove(user: {
        userId: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
