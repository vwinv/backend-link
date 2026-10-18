import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ShareCardDto } from './dto/share-card.dto';
import { SharingService } from './sharing.service';

@ApiTags('Sharing')
@Controller('sharing')
export class SharingController {
  constructor(
    private readonly sharingService: SharingService,
    private readonly jwtService: JwtService,
  ) {}

  private resolveViewerUserId(req: Request): string | undefined {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return undefined;
    }

    try {
      const payload = this.jwtService.verify<{ sub?: string }>(
        authorization.slice('Bearer '.length),
      );
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  private resolveViewMeta(req: Request): {
    source?: string;
    userAgent?: string;
  } {
    const source =
      typeof req.query.source === 'string' ? req.query.source : undefined;
    const userAgent = req.headers['user-agent'];
    return {
      source,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
    };
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Afficher une carte publique par slug (JSON)' })
  getPublicCard(@Param('slug') slug: string, @Req() req: Request) {
    return this.sharingService.getPublicCard(
      slug,
      this.resolveViewerUserId(req),
      this.resolveViewMeta(req),
    );
  }

  @Get('public/:slug/view')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({ summary: 'Page HTML publique de la carte' })
  async renderPublicCardPage(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const html = await this.sharingService.renderPublicCardPage(slug, {
      viewerUserId: this.resolveViewerUserId(req),
      ...this.resolveViewMeta(req),
    });
    if (!html) {
      return res
        .status(404)
        .type('text/html; charset=utf-8')
        .send(this.sharingService.renderPublicCardNotFoundPage());
    }

    return res.status(200).type('text/html; charset=utf-8').send(html);
  }

  @Get('public/:slug/contact.vcf')
  @ApiOperation({
    summary: 'Fichier vCard de la carte publique (enregistrement dans le téléphone)',
  })
  async downloadPublicContact(
    @Param('slug') slug: string,
    @Res() res: Response,
  ) {
    const vcard = await this.sharingService.renderPublicVCard(slug);
    if (!vcard) {
      return res.status(404).type('text/plain; charset=utf-8').send('Carte introuvable');
    }

    const filename = `${slug.replace(/[^a-zA-Z0-9_-]/g, '') || 'contact'}.vcf`;
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${filename}"`,
    );
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(vcard);
  }

  @Post('public/:slug/save')
  @ApiOperation({
    summary: 'Enregistrer qu’un visiteur a sauvegardé la carte (page publique)',
  })
  recordPublicCardSave(@Param('slug') slug: string, @Req() req: Request) {
    return this.sharingService.recordCardSave(
      slug,
      this.resolveViewerUserId(req),
    );
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

  @Get('quota')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quota de partages restant' })
  getShareQuota(@CurrentUser() user: { userId: string }) {
    return this.sharingService.getShareQuota(user.userId);
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
