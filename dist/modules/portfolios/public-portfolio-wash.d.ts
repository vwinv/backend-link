export type PageWash = {
    ink: string;
    muted: string;
    glass: string;
    line: string;
    button: string;
    buttonInk: string;
    track: string;
};
export declare function pageWash(start: string, end: string): PageWash;
export declare function hexToRgba(hex: string, alpha: number): string;
