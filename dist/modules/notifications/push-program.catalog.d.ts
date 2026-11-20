export type PushProgramFamily = 'inactivity' | 'calendar' | 'onboarding' | 'view';
export type PushProgramMessage = {
    number: number;
    body: string;
    family: PushProgramFamily;
    priority: 1 | 2 | 3 | 4;
};
export declare const PUSH_PROGRAM_TITLE = "Drop One";
export declare const PUSH_SEND_WINDOW: {
    readonly startHour: 8;
    readonly endHour: 21;
};
export declare const DEFAULT_PUSH_TIMEZONE = "Africa/Dakar";
export declare const PUSH_HOUR_TOLERANCE_MINUTES = 14;
export declare const WEDNESDAY_ROTATION: readonly [7, 8, 9, 10, 19];
export declare const INACTIVITY_WEEKLY_ROTATION: readonly [1, 2, 3, 4, 5, 6];
export declare const PREMIUM_MONTHLY_ROTATION: readonly [13, 14, 15];
export declare const INACTIVITY_SCHEDULE: ReadonlyArray<{
    days: number;
    messageNumber: number;
    hour: number;
    minute: number;
}>;
export declare const PUSH_PROGRAM_BODIES: Readonly<Record<number, string>>;
export declare function getPushProgramBody(messageNumber: number): string | null;
export declare function familyForMessage(messageNumber: number): PushProgramFamily;
export declare function priorityForFamily(family: PushProgramFamily): 1 | 2 | 3 | 4;
