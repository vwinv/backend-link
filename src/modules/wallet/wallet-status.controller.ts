import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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

  @Get('status/selftest.pkpass')
  @ApiOperation({
    summary: 'Diagnostic : télécharge le pass Apple de test en binaire brut',
  })
  async selfTestPkpass(@Res() res: Response) {
    const buffer = await this.appleWalletService.selfTestBuffer();
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="dropone-selftest.pkpass"',
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }
}
