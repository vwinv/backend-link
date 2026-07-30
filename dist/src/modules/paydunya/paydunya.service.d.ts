import type { PaydunyaSoftPayResponse, SoftPayFreeMoneySenegalInput, SoftPayOrangeMoneySenegalInput, SoftPayWaveSenegalInput } from './paydunya-softpay.types';
export type CreatePaydunyaInvoiceInput = {
    totalAmountFcfa: number;
    description: string;
    storeName: string;
    callbackUrl: string;
    returnUrl?: string;
    cancelUrl?: string;
    customData: Record<string, string | number | boolean | null | undefined>;
};
export type CreatePaydunyaInvoiceResult = {
    checkoutUrl: string;
    invoiceToken: string;
    responseCode: string;
    responseText: string;
};
export type PaydunyaConfirmInvoiceResult = {
    hash: string;
    status: string;
    totalAmount: number;
    invoiceToken: string;
    customData: Record<string, unknown>;
};
export declare class PaydunyaService {
    private readonly logger;
    private masterKey;
    private privateKey;
    private token;
    private baseUrl;
    private paydunyaAuthHeaders;
    private parseSoftPayResponse;
    softPayPost(path: string, body: Record<string, unknown>): Promise<PaydunyaSoftPayResponse>;
    isConfigured(): boolean;
    verifyIpnHash(receivedHash: string | undefined | null): boolean;
    createCheckoutInvoice(input: CreatePaydunyaInvoiceInput): Promise<CreatePaydunyaInvoiceResult>;
    confirmCheckoutInvoice(invoiceToken: string): Promise<PaydunyaConfirmInvoiceResult | null>;
    softPayOrangeMoneySenegal(input: SoftPayOrangeMoneySenegalInput): Promise<PaydunyaSoftPayResponse>;
    softPayFreeMoneySenegal(input: SoftPayFreeMoneySenegalInput): Promise<PaydunyaSoftPayResponse>;
    softPayWaveSenegal(input: SoftPayWaveSenegalInput): Promise<PaydunyaSoftPayResponse>;
}
