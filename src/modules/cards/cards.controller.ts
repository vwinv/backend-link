import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { SyncSocialLinksDto } from './dto/sync-social-links.dto';
import { UpdateCardThemeDto } from './dto/update-card-theme.dto';
import { CardsService } from './cards.service';

@ApiTags('Business Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une carte de visite' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateCardDto,
  ) {
    return this.cardsService.create(user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les cartes de l\'utilisateur' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.cardsService.findAll(user.userId);
  }

  @Get('shared-with-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les cartes partagées avec moi' })
  findSharedWithMe(@CurrentUser() user: { userId: string }) {
    return this.cardsService.findSharedWithMe(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer une carte par ID' })
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.cardsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une carte de visite' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(user.userId, id, dto);
  }

  @Patch(':id/theme')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Personnaliser le thème de la carte' })
  updateTheme(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateCardThemeDto,
  ) {
    return this.cardsService.updateTheme(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une carte de visite' })
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }

  @Put(':id/social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synchroniser les liens sociaux de la carte' })
  syncSocialLinks(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: SyncSocialLinksDto,
  ) {
    return this.cardsService.syncSocialLinks(user.userId, id, dto.links);
  }

  @Get(':id/social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les liens sociaux de la carte' })
  getSocialLinks(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.cardsService.getSocialLinks(user.userId, id);
  }

  @Post(':id/social-links')
  @ApiOperation({ summary: 'Ajouter un lien social à la carte' })
  addSocialLink(@Param('id') id: string) {
    return this.cardsService.addSocialLink(id);
  }

  @Delete(':id/social-links/:linkId')
  @ApiOperation({ summary: 'Supprimer un lien social' })
  removeSocialLink(@Param('id') id: string, @Param('linkId') linkId: string) {
    return this.cardsService.removeSocialLink(id, linkId);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques de vues, partages et enregistrements' })
  getAnalytics(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.cardsService.getAnalytics(user.userId, id);
  }
}
