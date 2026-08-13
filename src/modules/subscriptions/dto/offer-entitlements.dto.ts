import { ApiProperty } from '@nestjs/swagger';
import { OfferAudience } from '@prisma/client';

export class OfferEntitlementsDto {
  @ApiProperty({ enum: OfferAudience, example: OfferAudience.PERSONAL })
  audience: OfferAudience;

  @ApiProperty({ example: true })
  canCustomize: boolean;

  @ApiProperty({
    example: 5,
    description:
      'Nombre max de membres équipe (0 = perso, -1 = illimité)',
  })
  maxTeamMembers: number;

  @ApiProperty({ example: true })
  hasPortfolio: boolean;

  @ApiProperty({ example: true })
  hasWallet: boolean;

  @ApiProperty({ example: true })
  hasAnalytics: boolean;

  @ApiProperty({
    example: true,
    description: 'Visiteurs détaillés / historique (Premium Plus+)',
  })
  hasVisitorInsights: boolean;

  @ApiProperty({ example: true })
  hasSocialLinks: boolean;

  @ApiProperty({
    example: -1,
    description: 'Quota de scans IA (-1 = illimité, 0 = aucun)',
  })
  maxAiScans: number;

  @ApiProperty({
    example: -1,
    description: 'Quota de partages (-1 = illimité)',
  })
  maxShares: number;
}
