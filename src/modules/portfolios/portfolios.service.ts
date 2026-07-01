import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class PortfoliosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePortfolioDto) {
    return { message: 'create portfolio', dto };
  }

  findByCard(cardId: string) {
    return { message: 'findByCard', cardId };
  }

  findOne(id: string) {
    return { message: 'findOne portfolio', id };
  }

  update(id: string, dto: UpdatePortfolioDto) {
    return { message: 'update portfolio', id, dto };
  }

  remove(id: string) {
    return { message: 'remove portfolio', id };
  }

  addProject(id: string, dto: CreateProjectDto) {
    return { message: 'addProject', id, dto };
  }

  updateProject(id: string, projectId: string, dto: UpdateProjectDto) {
    return { message: 'updateProject', id, projectId, dto };
  }

  removeProject(id: string, projectId: string) {
    return { message: 'removeProject', id, projectId };
  }
}
