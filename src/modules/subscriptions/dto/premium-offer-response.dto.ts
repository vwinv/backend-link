import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferAudience } from '@prisma/client';
import { PremiumOfferPriceResponseDto } from './premium-offer-price-response.dto';

export class PremiumOfferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'DropOne Premium' })
  title: string;

  @ApiProperty({ example: 'link-premium' })
  slug: string;

  @ApiPropertyOptional({ example: 'Carte personnelle enrichie' })
  subtitle?: string | null;

  @ApiProperty({ enum: OfferAudience })
  audience: OfferAudience;

  @ApiProperty({ example: true })
  canCustomize: boolean;

  @ApiProperty({ example: 0 })
  maxTeamMembers: number;

  @ApiProperty({
    example: 1,
    description: 'Minimum d’utilisateurs à l’achat (offres pro)',
  })
  minSeats: number;

  @ApiProperty({ example: true })
  hasPortfolio: boolean;

  @ApiProperty({ example: true })
  hasWallet: boolean;

  @ApiProperty({ example: true })
  hasAnalytics: boolean;

  @ApiProperty({ example: false })
  hasVisitorInsights: boolean;

  @ApiProperty({ example: true })
  hasSocialLinks: boolean;

  @ApiProperty({ example: -1 })
  maxAiScans: number;

  @ApiProperty({
    example: -1,
    description: 'Quota de partages (-1 = illimité)',
  })
  maxShares: number;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiProperty({ type: [PremiumOfferPriceResponseDto] })
  prices: PremiumOfferPriceResponseDto[];
}
