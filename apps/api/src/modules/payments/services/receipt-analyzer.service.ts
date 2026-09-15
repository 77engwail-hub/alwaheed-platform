import type { ExtractedReceiptData } from '@al-waheed/types';
import { PaymentAdapterFactory } from '../adapters/adapter.factory.js';

export class ReceiptAnalyzerService {
  /**
   * Analyze raw OCR text and extract structured payment fields
   */
  public static analyzeReceiptText(
    rawOcrText: string,
    suggestedProviderCode?: string
  ): { extractedData: ExtractedReceiptData; detectedProvider: string } {
    if (!rawOcrText || rawOcrText.trim().length === 0) {
      return {
        detectedProvider: suggestedProviderCode || 'MANUAL_WALLET',
        extractedData: {
          walletProvider: suggestedProviderCode || 'MANUAL_WALLET',
          amount: null,
          currency: 'YER',
          referenceNumber: null,
          senderName: null,
          receiverName: null,
          averageConfidence: 0,
          paymentStatus: 'UNREADABLE',
        },
      };
    }

    // Provider auto-detection from OCR keywords
    let detectedProvider = suggestedProviderCode || 'MANUAL_WALLET';
    const lowerText = rawOcrText.toLowerCase();

    if (lowerText.includes('one cash') || lowerText.includes('ون كاش') || lowerText.includes('onecash')) {
      detectedProvider = 'ONE_CASH';
    } else if (lowerText.includes('jawali') || lowerText.includes('جوالي') || lowerText.includes('وي كاش')) {
      detectedProvider = 'JAWALI';
    } else if (lowerText.includes('floosak') || lowerText.includes('فلوسك') || lowerText.includes('كريمي') || lowerText.includes('kuraimi')) {
      detectedProvider = 'FLOOSAK';
    } else if (lowerText.includes('كاش') || lowerText.includes('cash')) {
      detectedProvider = 'CASH';
    } else if (lowerText.includes('sabacash') || lowerText.includes('سبأكاش') || lowerText.includes('سبأ كاش')) {
      detectedProvider = 'SABA_CASH';
    } else if (lowerText.includes('cac') || lowerText.includes('كاك') || lowerText.includes('موبايل موني')) {
      detectedProvider = 'CAC_MOBILY';
    } else if (lowerText.includes('mpay') || lowerText.includes('إم بي') || lowerText.includes('المتكاملة')) {
      detectedProvider = 'MPAY';
    }

    // Select provider adapter and parse
    const adapter = PaymentAdapterFactory.getAdapter(detectedProvider);
    const extractedData = adapter.parseReceiptText(rawOcrText);

    return {
      detectedProvider,
      extractedData,
    };
  }
}
