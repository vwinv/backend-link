import type { ProDesignTemplate } from './pro-design.types';
export declare const DEFAULT_PRO_DESIGN_ID = "uni";
export declare const DEFAULT_UNI_BACKGROUND = "#121212";
export declare const PRO_DESIGN_TEMPLATES: ProDesignTemplate[];
export declare function getProDesignTemplate(id?: string | null): ProDesignTemplate;
export declare function applyBrandColorToTemplate(template: ProDesignTemplate, brandColor: string): ProDesignTemplate;
