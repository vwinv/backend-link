import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export const PORTFOLIO_LAYOUTS = [
  'classique',
  'couverture',
  'editorial',
  'galerie',
  'minimal',
  'bento',
  'portrait',
  'cartes',
] as const;

export const PORTFOLIO_COLORS = [
  'bleu',
  'ivoire',
  'noir',
  'foret',
  'neon',
  'corail',
  'lagon',
  'lilas',
  'terre',
  'sable',
  'soleil',
  'minuit',
] as const;

export class SavePortfolioStyleDto {
  @ApiProperty({ enum: PORTFOLIO_LAYOUTS, example: 'classique' })
  @IsString()
  @IsIn(PORTFOLIO_LAYOUTS)
  layout: (typeof PORTFOLIO_LAYOUTS)[number];

  @ApiProperty({ enum: PORTFOLIO_COLORS, example: 'neon' })
  @IsString()
  @IsIn(PORTFOLIO_COLORS)
  color: (typeof PORTFOLIO_COLORS)[number];
}
