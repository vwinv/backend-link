import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un portfolio lié à une carte' })
  create(@Body() dto: CreatePortfolioDto) {
    return this.portfoliosService.create(dto);
  }

  @Get('card/:cardId')
  @ApiOperation({ summary: 'Récupérer le portfolio d\'une carte' })
  findByCard(@Param('cardId') cardId: string) {
    return this.portfoliosService.findByCard(cardId);
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
