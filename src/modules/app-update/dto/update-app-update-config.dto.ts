import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** Vide ou semver-like (1 / 1.0 / 1.0.1). */
const SEMVER_OR_EMPTY = /^(?:|(?:\d+)(?:\.\d+){0,3}(?:[-a-zA-Z0-9.]*)?)$/;

export class UpdateAppUpdateConfigDto {
  @ApiPropertyOptional({ example: '1.0.1' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(SEMVER_OR_EMPTY, {
    message: 'latestVersion doit être vide ou ressembler à 1.0.1',
  })
  latestVersion?: string;

  @ApiPropertyOptional({ example: '1.0.0' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(SEMVER_OR_EMPTY, {
    message: 'minVersion doit être vide ou ressembler à 1.0.0',
  })
  minVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  iosStoreUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  androidStoreUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
