export type CoverSocialLink = {
    platform: string;
    url: string;
};
export type CoverProject = {
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    projectUrl?: string | null;
};
export type CoverExperience = {
    role: string;
    company?: string | null;
    period?: string | null;
    missions?: string | null;
};
export type CoverTeaching = {
    title: string;
    school?: string | null;
    year?: string | null;
    audience?: string | null;
};
export type CoverSkill = {
    name: string;
    level: number;
};
export type CoverPortfolioInput = {
    firstName: string;
    lastName: string;
    jobTitle?: string | null;
    company?: string | null;
    bio?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    photoUrl?: string | null;
    pageUrl: string;
    vcardUrl: string;
    accentStart: string;
    accentEnd: string;
    colorId?: string;
    socialLinks: CoverSocialLink[];
    projects: CoverProject[];
    experiences?: CoverExperience[];
    teachings?: CoverTeaching[];
    skills?: CoverSkill[];
    competences?: string[];
    strengths?: string[];
    interests?: string[];
};
export declare function buildCoverPortfolioHtml(input: CoverPortfolioInput): string;
export declare function coverAccent(color: string): {
    start: string;
    end: string;
};
