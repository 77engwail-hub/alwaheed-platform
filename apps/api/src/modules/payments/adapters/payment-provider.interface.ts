import type { ExtractedReceiptData, PaymentMethodType } from '@al-waheed/types';

export interface VerificationContext {
  expectedAmount: number;
  currency: string;
  orderNumber?: string;
  customerName?: string;
  merchantAccount?: {
    accountNumber?: string | null;
    walletNumber?: string | null;
    merchantId?: string | null;
    merchantPaymentNumber?: string | null;
    accountHolderName: string;
  };
}

export interface AdapterVerificationResult {
  isVerified: boolean;
  score: number;
  extractedData: ExtractedReceiptData;
  matchedFields: {
    amountMatched: boolean;
    receiverMatched: boolean;
    referenceValid: boolean;
    dateValid: boolean;
  };
  notes: string[];
}

export interface PaymentProviderAdapter {
  readonly providerCode: string;
  readonly providerNameAr: string;
  readonly providerNameEn: string;

  /**
   * Parse OCR raw text to structured receipt fields
   */
  parseReceiptText(ocrText: string): ExtractedReceiptData;

  /**
   * Validate if the receiver details extracted from the receipt match our merchant store account
   */
  validateReceiver(
    extracted: ExtractedReceiptData,
    merchantAccount?: VerificationContext['merchantAccount']
  ): { matched: boolean; score: number; details: string };

  /**
   * Optional API verification method if official API credentials exist
   */
  verifyViaApi?(
    transactionReference: string,
    credentials: any
  ): Promise<{ isSuccess: boolean; details: any }>;

  /**
   * Optional Webhook handler method if provider sends webhooks
   */
  handleWebhook?(
    payload: any,
    signature: string,
    secret: string
  ): Promise<{ isVerified: boolean; transactionId: string; amount: number }>;
}
