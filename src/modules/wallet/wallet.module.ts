import { Module } from '@nestjs/common';
import { AppleWalletService } from './apple-wallet.service';
import { GoogleWalletService } from './google-wallet.service';
import { WalletConfig } from './wallet.config';
import { WalletController } from './wallet.controller';
import { WalletStatusController } from './wallet-status.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController, WalletStatusController],
  providers: [
    WalletConfig,
    AppleWalletService,
    GoogleWalletService,
    WalletService,
  ],
  exports: [WalletService],
})
export class WalletModule {}
