export declare class PortfolioExperienceDto {
    id: string;
    role: string;
    company?: string;
    period?: string;
    missions?: string;
}
export declare class PortfolioTeachingDto {
    id: string;
    title: string;
    school?: string;
    year?: string;
    audience?: string;
}
export declare class PortfolioSkillDto {
    id: string;
    name: string;
    level: number;
}
export declare class PortfolioProfileProjectDto {
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    projectUrl?: string;
}
export declare class SavePortfolioProfileDto {
    photoUrl?: string | null;
    firstName: string;
    lastName: string;
    age?: number | null;
    phone?: string | null;
    address?: string | null;
    hidePersonalDetails: boolean;
    title: string;
    description?: string | null;
    experiences: PortfolioExperienceDto[];
    teachings: PortfolioTeachingDto[];
    skills: PortfolioSkillDto[];
    competences: string[];
    strengths: string[];
    interests: string[];
    projects: PortfolioProfileProjectDto[];
}
