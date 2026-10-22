import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferBillingType } from '@prisma/client';

export class PremiumOfferPriceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: OfferBillingType })
  billingType: OfferBillingType;

  @ApiPropertyOptional({ example: '4 000 FCFA / mois' })
  priceLabel?: string | null;

  @ApiProperty({ example: 4000 })
  priceAmount: number;

  @ApiPropertyOptional({
    example: 700,
    description:
      'Prix par utilisateur supplémentaire (au-delà des sièges inclus). Montant = priceAmount + pricePerSeat × (sièges − minSeats).',
  })
  pricePerSeat?: number | null;

  @ApiProperty({ example: 'FCFA' })
  currency: string;

  @ApiPropertyOptional({ example: 40 })
  discountPercent?: number | null;

  @ApiPropertyOptional({ example: 'Populaire' })
  badgeLabel?: string | null;

  @ApiProperty({ example: true })
  isPopular: boolean;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiPropertyOptional({
    example: 'com.mega.dropone.premium.yearly',
    description: 'Identifiant produit App Store (IAP iOS)',
  })
  appleProductId?: string | null;
}
