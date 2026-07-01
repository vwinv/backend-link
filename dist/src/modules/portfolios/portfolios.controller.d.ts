import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PortfoliosService } from './portfolios.service';
export declare class PortfoliosController {
    private readonly portfoliosService;
    constructor(portfoliosService: PortfoliosService);
    create(dto: CreatePortfolioDto): {
        message: string;
        dto: CreatePortfolioDto;
    };
    findByCard(cardId: string): {
        message: string;
        cardId: string;
    };
    findOne(id: string): {
        message: string;
        id: string;
    };
    update(id: string, dto: UpdatePortfolioDto): {
        message: string;
        id: string;
        dto: UpdatePortfolioDto;
    };
    remove(id: string): {
        message: string;
        id: string;
    };
    addProject(id: string, dto: CreateProjectDto): {
        message: string;
        id: string;
        dto: CreateProjectDto;
    };
    updateProject(id: string, projectId: string, dto: UpdateProjectDto): {
        message: string;
        id: string;
        projectId: string;
        dto: UpdateProjectDto;
    };
    removeProject(id: string, projectId: string): {
        message: string;
        id: string;
        projectId: string;
    };
}
