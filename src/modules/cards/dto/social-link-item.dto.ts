import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SocialPlatform } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SocialLinkItemDto {
  @ApiProperty({ enum: SocialPlatform, example: SocialPlatform.LINKEDIN })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ example: 'https://linkedin.com/in/alexmoreau' })
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
