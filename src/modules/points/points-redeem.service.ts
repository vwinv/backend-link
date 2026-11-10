import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OfferBillingType, PointsProductType } from '@prisma/client';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PointsService } from './points.service';
import { tenthsToFcfa, tenthsToPoints } from './points.constants';

/**
 * Achats via points — séparé pour éviter les cycles Nest
 * (Points ↔ Subscriptions).
 */
@Injectable()
export class PointsRedeemService {
  constructor(
    private readonly pointsService: PointsService,
    @Inject(forwardRef(() => SubscriptionsService))
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async redeem(userId: string, dto: RedeemPointsDto) {
    if (dto.productType === PointsProductType.CARD_THEME) {
      throw new BadRequestException(
        'Les thèmes payants arriveront bientôt. Vos points pourront les acheter.',
      );
    }
    if (dto.productType !== PointsProductType.SUBSCRIPTION) {
      throw new BadRequestException('Produit non supporté');
    }
    if (!dto.billingType) {
      throw new BadRequestException('billingType requis');
    }

    const quote = await this.subscriptionsService.quoteSubscriptionAmount({
      userId,
      offerSlug: dto.productRef,
      billingType: dto.billingType,
      teamId: dto.teamId,
      seats: dto.seats,
    });

    const amountTenths = this.pointsService.fcfaToRequiredTenths(quote.amountFcfa);
    if (amountTenths <= 0) {
      throw new BadRequestException('Cette offre ne peut pas être payée en points');
    }

    // Débit d’abord ; remboursement si l’activation échoue.
    const debit = await this.pointsService.debitForPurchase({
      userId,
      amountTenths,
      productType: PointsProductType.SUBSCRIPTION,
      productRef: dto.productRef,
      meta: {
        billingType: dto.billingType,
        seats: dto.seats ?? null,
        amountFcfa: quote.amountFcfa,
      },
    });

    try {
      const subscription =
        await this.subscriptionsService.activateSubscriptionWithPoints({
          userId,
          offerSlug: dto.productRef,
          billingType: dto.billingType as OfferBillingType,
          teamId: dto.teamId,
          seats: dto.seats,
          invoiceAmount: quote.amountFcfa,
        });

      return {
        ok: true,
        productType: PointsProductType.SUBSCRIPTION,
        productRef: dto.productRef,
        pointsSpent: tenthsToPoints(amountTenths),
        amountFcfa: tenthsToFcfa(amountTenths),
        balancePoints: debit.balancePoints,
        subscriptionId: subscription.id,
      };
    } catch (error) {
      await this.pointsService.creditAdjustment({
        userId,
        amountTenths,
        meta: { refundOf: debit.entryId, reason: 'redeem_failed' },
      });
      throw error;
    }
  }
}
