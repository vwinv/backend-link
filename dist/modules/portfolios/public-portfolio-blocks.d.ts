export type BlockExperience = {
    role: string;
    company?: string | null;
    period?: string | null;
    missions?: string | null;
};
export type BlockTeaching = {
    title: string;
    school?: string | null;
    year?: string | null;
    audience?: string | null;
};
export type BlockSkill = {
    name: string;
    level: number;
};
export declare function renderEntryTimeline(items: BlockExperience[]): string;
export declare function renderJobTimeline(items: BlockExperience[]): string;
export declare function renderTeachings(items: BlockTeaching[]): string;
export declare function renderSkillBars(items: BlockSkill[]): string;
export declare function renderChipGroup(title: string, hint: string, items: string[], className?: string): string;
export declare function renderProfileExtras(input: {
    skills?: BlockSkill[];
    competences?: string[];
    strengths?: string[];
    interests?: string[];
}, options?: {
    includeSkills?: boolean;
    panel?: boolean;
}): string;
