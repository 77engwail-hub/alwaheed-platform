import type { AiRecommendation, ExtractedReceiptData } from '@al-waheed/types';
import { PaymentAdapterFactory } from '../adapters/adapter.factory.js';

export interface MatchingContext {
  expectedAmount: number;
  currency: string;
  orderNumber?: string;
  customerName?: string;
  providerCode: string;
  merchantAccount?: {
    accountNumber?: string | null;
    walletNumber?: string | null;
    merchantId?: string | null;
    merchantPaymentNumber?: string | null;
    accountHolderName: string;
  };
  isDuplicateImage?: boolean;
  isDuplicateReference?: boolean;
  duplicateDetails?: string;
}

export interface MatchingResult {
  totalScore: number; // 0 to 100
  amountMatchScore: number;
  receiverMatchScore: number;
  referenceValidationScore: number;
  dateTimeMatchScore: number;
  walletDetectionScore: number;
  ocrConfidenceScore: number;
  recommendation: AiRecommendation;
  integrityFlags: string[];
  notes: string[];
}

export class PaymentMatcherService {
  /**
   * Evaluate extracted receipt data against Order and Merchant expectations
   */
  public static evaluatePayment(
    extracted: ExtractedReceiptData,
    context: MatchingContext
  ): MatchingResult {
    const integrityFlags: string[] = [];
    const notes: string[] = [];

    // 1. Duplicate checks
    if (context.isDuplicateImage) {
      integrityFlags.push('DUPLICATE_IMAGE_DETECTED');
      notes.push('تم اكتشاف تطابق في صورة الإشعار مع معاملة سابقة (Image Hash Collision).');
    }

    if (context.isDuplicateReference) {
      integrityFlags.push('DUPLICATE_REFERENCE_NUMBER');
      notes.push('الرقم المرجعي للإشعار مسجل مسبقاً في النظام.');
    }

    // 2. Amount Matching (30% weight)
    let amountMatchScore = 0;
    const detectedAmount = extracted.amount;
    const expectedAmount = context.expectedAmount;

    if (detectedAmount === null || detectedAmount === undefined) {
      amountMatchScore = 0;
      notes.push('تعذر استخراج المبلغ من الإشعار بدقة كافية.');
    } else if (Math.abs(detectedAmount - expectedAmount) < 0.01) {
      amountMatchScore = 30;
      notes.push('المبلغ المستخرج مطابق تماماً لقيمة الطلب.');
    } else if (detectedAmount < expectedAmount) {
      // Partial payment
      amountMatchScore = Math.max(10, Math.round((detectedAmount / expectedAmount) * 30));
      notes.push(`المبلغ المدفوع (${detectedAmount}) أقل من إجمالي الطلب (${expectedAmount}) - دفعة جزئية.`);
    } else {
      // Overpayment
      amountMatchScore = 25;
      notes.push(`المبلغ المدفوع (${detectedAmount}) أكبر من إجمالي الطلب (${expectedAmount}) - فائض دفع.`);
    }

    // 3. Receiver Matching (25% weight)
    let receiverMatchScore = 0;
    const adapter = PaymentAdapterFactory.getAdapter(context.providerCode);
    const receiverCheck = adapter.validateReceiver(extracted, context.merchantAccount);

    if (receiverCheck.matched) {
      receiverMatchScore = Math.round(receiverCheck.score * 25);
      notes.push(receiverCheck.details);
    } else {
      receiverMatchScore = 0;
      integrityFlags.push('RECEIVER_MISMATCH');
      notes.push('بيانات المستفيد في الإشعار لا تتطابق مع حساب المتجر.');
    }

    // 4. Reference Validation (15% weight)
    let referenceValidationScore = 0;
    if (extracted.referenceNumber && extracted.referenceNumber.length >= 6) {
      if (!context.isDuplicateReference) {
        referenceValidationScore = 15;
        notes.push(`الرقم المرجعي سليم وفريد: ${extracted.referenceNumber}`);
      } else {
        referenceValidationScore = 0;
      }
    } else {
      referenceValidationScore = 0;
      notes.push('لم يتم العثور على رقم مرجعي واضح في الإشعار.');
    }

    // 5. Date / Time Validation (10% weight)
    let dateTimeMatchScore = 0;
    if (extracted.transactionDate) {
      dateTimeMatchScore = 10;
      notes.push(`تاريخ العملية: ${extracted.transactionDate}`);
    } else {
      dateTimeMatchScore = 5;
    }

    // 6. Wallet Detection (10% weight)
    let walletDetectionScore = 0;
    if (
      extracted.walletProvider &&
      extracted.walletProvider.toUpperCase() === context.providerCode.toUpperCase()
    ) {
      walletDetectionScore = 10;
      notes.push(`تطابق المحفظة المستخدمة: ${context.providerCode}`);
    } else if (extracted.walletProvider && extracted.walletProvider !== 'MANUAL_WALLET') {
      walletDetectionScore = 5;
      notes.push(`المحفظة المكتشفة (${extracted.walletProvider}) تختلف عن المحددة (${context.providerCode})`);
    } else {
      walletDetectionScore = 7;
    }

    // 7. OCR Confidence Score (10% weight)
    const avgConfidence = extracted.averageConfidence || 0;
    const ocrConfidenceScore = Math.round(avgConfidence * 10);

    // Calculate Total Score (0 - 100)
    let totalScore =
      amountMatchScore +
      receiverMatchScore +
      referenceValidationScore +
      dateTimeMatchScore +
      walletDetectionScore +
      ocrConfidenceScore;

    totalScore = Math.min(100, Math.max(0, totalScore));

    // Determine Recommendation
    let recommendation: AiRecommendation = 'MANUAL_REVIEW';

    if (context.isDuplicateImage || context.isDuplicateReference) {
      recommendation = 'SUSPICIOUS';
      totalScore = Math.min(totalScore, 40);
    } else if (detectedAmount === null || receiverMatchScore === 0) {
      recommendation = 'MANUAL_REVIEW';
    } else if (totalScore >= 80 && Math.abs((detectedAmount || 0) - expectedAmount) < 0.01) {
      recommendation = 'ACCEPT';
    } else if (totalScore >= 70 && (detectedAmount || 0) < expectedAmount) {
      recommendation = 'PARTIAL_PAYMENT';
    } else if (totalScore >= 70 && (detectedAmount || 0) > expectedAmount) {
      recommendation = 'OVERPAYMENT';
    } else if (totalScore < 50) {
      recommendation = 'REJECT';
    } else {
      recommendation = 'MANUAL_REVIEW';
    }

    return {
      totalScore,
      amountMatchScore,
      receiverMatchScore,
      referenceValidationScore,
      dateTimeMatchScore,
      walletDetectionScore,
      ocrConfidenceScore,
      recommendation,
      integrityFlags,
      notes,
    };
  }
}
