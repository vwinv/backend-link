import { PrismaService } from '../../prisma/prisma.service';
import { AppleWalletService } from './apple-wallet.service';
import { GoogleWalletService } from './google-wallet.service';
import { SaveToWalletDto } from './dto/save-to-wallet.dto';
export declare class WalletService {
    private readonly prisma;
    private readonly appleWalletService;
    private readonly googleWalletService;
    constructor(prisma: PrismaService, appleWalletService: AppleWalletService, googleWalletService: GoogleWalletService);
    addCardToWallet(userId: string, cardId: string, dto: SaveToWalletDto): Promise<{
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
    findAll(userId: string): Promise<({
        card: {
            id: string;
            firstName: string;
            lastName: string;
            jobTitle: string | null;
            company: string | null;
            slug: string;
        };
    } & {
        id: string;
        userId: string;
        cardId: string;
        savedAt: Date;
        walletType: import(".prisma/client").$Enums.WalletType;
        passId: string | null;
    })[]>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    private upsertSavedCard;
}
