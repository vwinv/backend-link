import { SocialPlatform } from '@prisma/client';
export declare class SocialLinkItemDto {
    platform: SocialPlatform;
    url: string;
    label?: string;
    order?: number;
}
