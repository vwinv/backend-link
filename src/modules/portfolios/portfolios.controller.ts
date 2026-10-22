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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { SavePortfolioProfileDto } from './dto/save-portfolio-profile.dto';
import { SavePortfolioStyleDto } from './dto/save-portfolio-style.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly jwtService: JwtService,
  ) {}

  private resolveViewerUserId(req: Request): string | undefined {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) return undefined;

    try {
      const payload = this.jwtService.verify<{ sub?: string }>(
        authorization.slice('Bearer '.length),
      );
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Créer un portfolio lié à une carte' })
  create(@Body() dto: CreatePortfolioDto) {
    return this.portfoliosService.create(dto);
  }

  @Get('card/:cardId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Visites du site et clics « Voir mon portfolio »',
  })
  getStats(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
  ) {
    return this.portfoliosService.getStats(user.userId, cardId);
  }

  @Post('public/:slug/click')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enregistrer un clic sur « Voir mon portfolio »',
  })
  recordClick(@Param('slug') slug: string, @Req() req: Request) {
    return this.portfoliosService.recordClick(
      slug,
      this.resolveViewerUserId(req),
    );
  }

  @Get('card/:cardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le portfolio d\'une carte' })
  findByCard(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
  ) {
    return this.portfoliosService.findOwnedByCard(user.userId, cardId);
  }

  @Get('card/:cardId/editor')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Contenu de l’éditeur de portfolio' })
  getEditor(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
  ) {
    return this.portfoliosService.getEditor(user.userId, cardId);
  }

  @Patch('card/:cardId/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enregistrer le contenu du portfolio' })
  saveProfile(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
    @Body() dto: SavePortfolioProfileDto,
  ) {
    return this.portfoliosService.saveProfile(user.userId, cardId, dto);
  }

  @Patch('card/:cardId/style')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Créer le portfolio ou mettre à jour son modèle et sa couleur',
  })
  saveStyle(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
    @Body() dto: SavePortfolioStyleDto,
  ) {
    return this.portfoliosService.saveStyle(user.userId, cardId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un portfolio par ID' })
  findOne(@Param('id') id: string) {
    return this.portfoliosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un portfolio' })
  update(@Param('id') id: string, @Body() dto: UpdatePortfolioDto) {
    return this.portfoliosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un portfolio' })
  remove(@Param('id') id: string) {
    return this.portfoliosService.remove(id);
  }

  @Post(':id/projects')
  @ApiOperation({ summary: 'Ajouter un projet au portfolio' })
  addProject(@Param('id') id: string, @Body() dto: CreateProjectDto) {
    return this.portfoliosService.addProject(id, dto);
  }

  @Patch(':id/projects/:projectId')
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  updateProject(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.portfoliosService.updateProject(id, projectId, dto);
  }

  @Delete(':id/projects/:projectId')
  @ApiOperation({ summary: 'Supprimer un projet' })
  removeProject(@Param('id') id: string, @Param('projectId') projectId: string) {
    return this.portfoliosService.removeProject(id, projectId);
  }
}
