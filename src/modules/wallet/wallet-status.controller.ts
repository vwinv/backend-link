import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppleWalletService } from './apple-wallet.service';
import { WalletConfig } from './wallet.config';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletStatusController {
  constructor(
    private readonly walletConfig: WalletConfig,
    private readonly appleWalletService: AppleWalletService,
  ) {}

  @Get('status')
  @ApiOperation({
    summary: 'Diagnostic : état de configuration du wallet (aucun secret exposé)',
  })
  status() {
    return this.walletConfig.describe();
  }

  @Get('status/selftest')
  @ApiOperation({
    summary: 'Diagnostic : génère un pass Apple de test et renvoie sa taille/magic',
  })
  selfTest() {
    return this.appleWalletService.selfTest();
  }
}
