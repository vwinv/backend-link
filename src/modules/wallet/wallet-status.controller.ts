import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletConfig } from './wallet.config';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletStatusController {
  constructor(private readonly walletConfig: WalletConfig) {}

  @Get('status')
  @ApiOperation({
    summary: 'Diagnostic : état de configuration du wallet (aucun secret exposé)',
  })
  status() {
    return {
      apple: this.walletConfig.isAppleConfigured(),
      google: this.walletConfig.isGoogleConfigured(),
    };
  }
}
