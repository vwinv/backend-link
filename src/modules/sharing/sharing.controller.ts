import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShareCardDto } from './dto/share-card.dto';
import { SharingService } from './sharing.service';

@ApiTags('Sharing')
@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  @Get('public/:slug')
  @ApiOperation({ summary: 'Afficher une carte publique par slug (JSON)' })
  getPublicCard(@Param('slug') slug: string) {
    return this.sharingService.getPublicCard(slug);
  }

  @Get('public/:slug/view')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({ summary: 'Page HTML publique de la carte' })
  async renderPublicCardPage(
    @Param('slug') slug: string,
    @Res() res: Response,
  ) {
    const html = await this.sharingService.renderPublicCardPage(slug);
    if (!html) {
      return res
        .status(404)
        .type('text/html; charset=utf-8')
        .send(this.sharingService.renderPublicCardNotFoundPage());
    }

    return res.status(200).type('text/html; charset=utf-8').send(html);
  }

  @Post('public/:slug/save')
  @ApiOperation({
    summary: 'Enregistrer qu’un visiteur a sauvegardé la carte (page publique)',
  })
  recordPublicCardSave(@Param('slug') slug: string) {
    return this.sharingService.recordCardSave(slug);
  }

  @Post('cards/:id/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enregistrer un partage (WhatsApp, Airdrop, etc.)' })
  shareCard(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: ShareCardDto,
  ) {
    return this.sharingService.shareCard(user.userId, id, dto);
  }

  @Get('cards/:id/qr')
  @ApiOperation({ summary: 'Générer le QR code de partage' })
  getQrCode(@Param('id') id: string) {
    return this.sharingService.getQrCode(id);
  }

  @Get('cards/:id/link')
  @ApiOperation({ summary: 'Obtenir le lien de partage public' })
  getShareLink(@Param('id') id: string) {
    return this.sharingService.getShareLink(id);
  }
}
