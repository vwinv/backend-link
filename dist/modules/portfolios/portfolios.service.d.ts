import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { EntitlementsService } from '../subscriptions/entitlements.service';
import { SavePortfolioProfileDto } from './dto/save-portfolio-profile.dto';
import { SavePortfolioStyleDto } from './dto/save-portfolio-style.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class PortfoliosService {
    private readonly prisma;
    private readonly configService;
    private readonly entitlementsService;
    constructor(prisma: PrismaService, configService: ConfigService, entitlementsService: EntitlementsService);
    private get appPublicUrl();
    create(dto: CreatePortfolioDto): {
        message: string;
        dto: CreatePortfolioDto;
    };
    findOwnedByCard(userId: string, cardId: string): Promise<{
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
    saveStyle(userId: string, cardId: string, dto: SavePortfolioStyleDto): Promise<{
        exists: boolean;
        id: string;
        title: string;
        layout: "classique" | "couverture" | "editorial" | "galerie" | "minimal" | "bento" | "portrait" | "cartes";
        color: "noir" | "bleu" | "ivoire" | "foret" | "neon" | "corail" | "lagon" | "lilas" | "terre" | "sable" | "soleil" | "minuit";
    }>;
    getEditor(userId: string, cardId: string): Promise<{
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
    saveProfile(userId: string, cardId: string, dto: SavePortfolioProfileDto): Promise<{
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
    private readContent;
    private ownedCard;
    private readTheme;
    private themePayload;
    getStats(userId: string, cardId: string): Promise<{
        siteVisits: number;
        portfolioClicks: number;
    }>;
    recordClick(slug: string, viewerUserId?: string): Promise<{
        ok: boolean;
        counted: boolean;
    }>;
    notFoundPage(): string;
    renderPublicPage(slug: string, viewerUserId?: string, embed?: boolean, preview?: {
        layout?: string;
        color?: string;
    }): Promise<string | null>;
    private initials;
    private resolveAssetUrl;
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
