import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SocialLinkItemDto } from './social-link-item.dto';

export class SyncSocialLinksDto {
  @ApiProperty({ type: [SocialLinkItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkItemDto)
  links: SocialLinkItemDto[];
}
