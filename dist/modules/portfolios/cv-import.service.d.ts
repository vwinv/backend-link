import { ConfigService } from '@nestjs/config';
type CvDraft = {
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
        title: string;
        description: string;
        projectUrl: string;
    }[];
};
export declare class CvImportService {
    private readonly configService;
    constructor(configService: ConfigService);
    extractDraftFromPdf(file: Express.Multer.File): Promise<CvDraft>;
    private assertPdf;
    private extractText;
    private structureWithOpenAi;
    private normalizeDraft;
}
export {};
