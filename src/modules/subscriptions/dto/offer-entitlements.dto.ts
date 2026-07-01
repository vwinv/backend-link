import { ApiProperty } from '@nestjs/swagger';
import { OfferAudience } from '@prisma/client';

export class OfferEntitlementsDto {
  @ApiProperty({ enum: OfferAudience, example: OfferAudience.PERSONAL })
  audience: OfferAudience;

  @ApiProperty({ example: true })
  canCustomize: boolean;

  @ApiProperty({
    example: 5,
    description: 'Nombre max de membres équipe (0 si offre personnelle)',
  })
  maxTeamMembers: number;

  @ApiProperty({ example: true })
  hasPortfolio: boolean;

  @ApiProperty({
    example: -1,
    description: 'Quota de scans IA (-1 = illimité, 0 = aucun)',
  })
  maxAiScans: number;
}
