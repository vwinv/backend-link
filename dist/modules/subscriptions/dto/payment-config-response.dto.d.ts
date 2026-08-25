export declare class PaymentConfigResponseDto {
    paymentsEnabled: boolean;
    hideInAppPayments: boolean;
    provider?: string;
}
export declare class CheckoutSessionResponseDto {
    checkoutUrl: string;
    invoiceToken: string;
    sessionId: string;
    amountFcfa?: number;
    description?: string;
}
