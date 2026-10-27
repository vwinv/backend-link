import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { SavePortfolioProfileDto } from './dto/save-portfolio-profile.dto';
import { SavePortfolioStyleDto } from './dto/save-portfolio-style.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PortfoliosService } from './portfolios.service';
export declare class PortfoliosController {
    private readonly portfoliosService;
    private readonly jwtService;
    constructor(portfoliosService: PortfoliosService, jwtService: JwtService);
    private resolveViewerUserId;
    create(dto: CreatePortfolioDto): {
        message: string;
        dto: CreatePortfolioDto;
    };
    getStats(user: {
        userId: string;
    }, cardId: string): Promise<{
        siteVisits: number;
        portfolioClicks: number;
    }>;
    recordClick(slug: string, req: Request): Promise<{
        ok: boolean;
        counted: boolean;
    }>;
    findByCard(user: {
        userId: string;
    }, cardId: string): Promise<{
        exists: boolean;
        id?: undefined;
        title?: undefined;
        layout?: undefined;
        color?: undefined;
    } | {
        exists: boolean;
        id: string;
        title: string;
        layout: string;
        color: string;
    }>;
    getEditor(user: {
        userId: string;
    }, cardId: string): Promise<{
        exists: boolean;
        id?: undefined;
        photoUrl?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        age?: undefined;
        phone?: undefined;
        address?: undefined;
        hidePersonalDetails?: undefined;
        title?: undefined;
        description?: undefined;
        experiences?: undefined;
        teachings?: undefined;
        skills?: undefined;
        competences?: undefined;
        strengths?: undefined;
        interests?: undefined;
        projects?: undefined;
    } | {
        exists: boolean;
        id: string;
        photoUrl: string | null;
        firstName: string;
        lastName: string;
        age: number | null;
        phone: string;
        address: string;
        hidePersonalDetails: boolean;
        title: string;
        description: string;
        experiences: {
            id: string;
            role: string;
            company: string;
            period: string;
            missions: string;
        }[];
        teachings: {
            id: string;
            title: string;
            school: string;
            year: string;
            audience: string;
        }[];
        skills: {
            id: string;
            name: string;
            level: number;
        }[];
        competences: string[];
        strengths: string[];
        interests: string[];
        projects: {
            id: string;
            title: string;
            description: string;
            imageUrl: string | null;
            projectUrl: string | null;
        }[];
    }>;
    saveProfile(user: {
        userId: string;
    }, cardId: string, dto: SavePortfolioProfileDto): Promise<{
        exists: boolean;
        id?: undefined;
        photoUrl?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        age?: undefined;
        phone?: undefined;
        address?: undefined;
        hidePersonalDetails?: undefined;
        title?: undefined;
        description?: undefined;
        experiences?: undefined;
        teachings?: undefined;
        skills?: undefined;
        competences?: undefined;
        strengths?: undefined;
        interests?: undefined;
        projects?: undefined;
    } | {
        exists: boolean;
        id: string;
        photoUrl: string | null;
        firstName: string;
        lastName: string;
        age: number | null;
        phone: string;
        address: string;
        hidePersonalDetails: boolean;
        title: string;
        description: string;
        experiences: {
            id: string;
            role: string;
            company: string;
            period: string;
            missions: string;
        }[];
        teachings: {
            id: string;
            title: string;
            school: string;
            year: string;
            audience: string;
        }[];
        skills: {
            id: string;
            name: string;
            level: number;
        }[];
        competences: string[];
        strengths: string[];
        interests: string[];
        projects: {
            id: string;
            title: string;
            description: string;
            imageUrl: string | null;
            projectUrl: string | null;
        }[];
    }>;
    saveStyle(user: {
        userId: string;
    }, cardId: string, dto: SavePortfolioStyleDto): Promise<{
        exists: boolean;
        id: string;
        title: string;
        layout: "classique" | "couverture" | "editorial" | "galerie" | "minimal" | "bento" | "portrait" | "cartes";
        color: "noir" | "bleu" | "ivoire" | "foret" | "neon" | "corail" | "lagon" | "lilas" | "terre" | "sable" | "soleil" | "minuit";
    }>;
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
