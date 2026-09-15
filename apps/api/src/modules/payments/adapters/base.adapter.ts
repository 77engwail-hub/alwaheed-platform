import type { ExtractedReceiptData } from '@al-waheed/types';
import type { PaymentProviderAdapter, VerificationContext } from './payment-provider.interface.js';

export abstract class BasePaymentAdapter implements PaymentProviderAdapter {
  abstract readonly providerCode: string;
  abstract readonly providerNameAr: string;
  abstract readonly providerNameEn: string;

  /**
   * Arabic-Indic to Western Arabic digit normalization (e.g. ٠١٢٣٤٥٦٧٨٩ -> 0123456789)
   */
  public normalizeNumbers(input: string): string {
    if (!input) return '';
    const arabicIndicDigits: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    };
    return input.replace(/[٠-٩۰-۹]/g, (w) => arabicIndicDigits[w] || w);
  }

  /**
   * Clean and parse currency amounts from text (e.g., "25,000 YER", "٢٥٠٠٠ ر.ي", "70,500.00")
   */
  public parseAmountFromText(text: string): { amount: number | null; confidence: number } {
    if (!text) return { amount: null, confidence: 0 };
    const normalized = this.normalizeNumbers(text);

    // Regex matching amount with optional commas and decimals
    const amountRegexes = [
      /(?:المبلغ|المبلغ المدفوع|القيمة|Amount|Total|Paid)\s*[:=]?\s*([0-9]{1,3}(?:[,،][0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)/i,
      /([0-9]{1,3}(?:[,،][0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:ريال|ر\.ي|YER|YR|YER|USD|\$)/i,
      /([0-9]{1,3}(?:[,،][0-9]{3})+(?:\.[0-9]{1,2})?)/,
    ];

    for (const rx of amountRegexes) {
      const match = normalized.match(rx);
      if (match && match[1]) {
        const rawNum = match[1].replace(/[,،]/g, '');
        const val = parseFloat(rawNum);
        if (!isNaN(val) && val > 0) {
          return { amount: val, confidence: 0.95 };
        }
      }
    }

    return { amount: null, confidence: 0 };
  }

  /**
   * Extract Reference / Transaction ID (e.g. "رقم العملية: 89347219", "Ref: 981245")
   */
  public parseReferenceNumber(text: string): { reference: string | null; confidence: number } {
    if (!text) return { reference: null, confidence: 0 };
    const normalized = this.normalizeNumbers(text);

    const refRegexes = [
      /(?:رقم العملية|الرقم المرجعي|رقم الإشعار|رقم الحوالة|مرجع|Ref|Txn ID|Transaction ID|Ref No|Reference)\s*[:#-]?\s*([A-Za-z0-9\-_]{6,30})/i,
      /(?:TRX|TXN|REF|OPR)[:#-]?\s*([A-Za-z0-9\-_]{6,30})/i,
    ];

    for (const rx of refRegexes) {
      const match = normalized.match(rx);
      if (match && match[1]) {
        return { reference: match[1].trim(), confidence: 0.92 };
      }
    }

    return { reference: null, confidence: 0 };
  }

  /**
   * Generic receipt text parsing logic
   */
  public parseReceiptText(ocrText: string): ExtractedReceiptData {
    const norm = this.normalizeNumbers(ocrText);
    const amountData = this.parseAmountFromText(norm);
    const refData = this.parseReferenceNumber(norm);

    // Sender & Receiver parsing
    const senderMatch = norm.match(/(?:من|المرسل|المحول|From|Sender)\s*[:=]?\s*([^\n\r,]+)/i);
    const receiverMatch = norm.match(/(?:إلى|المستفيد|المستلم|To|Receiver|Merchant)\s*[:=]?\s*([^\n\r,]+)/i);
    const dateMatch = norm.match(/(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/);
    const timeMatch = norm.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|ص|م)?)/i);

    const fieldConfidences: Record<string, number> = {
      amount: amountData.confidence,
      referenceNumber: refData.confidence,
      senderName: senderMatch ? 0.85 : 0,
      receiverName: receiverMatch ? 0.85 : 0,
      transactionDate: dateMatch ? 0.9 : 0,
      transactionTime: timeMatch ? 0.88 : 0,
    };

    const validScores = Object.values(fieldConfidences).filter((s) => s > 0);
    const averageConfidence = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;

    return {
      walletProvider: this.providerCode,
      amount: amountData.amount,
      currency: 'YER',
      referenceNumber: refData.reference,
      senderName: senderMatch ? senderMatch[1].trim() : null,
      receiverName: receiverMatch ? receiverMatch[1].trim() : null,
      transactionDate: dateMatch ? dateMatch[1].trim() : null,
      transactionTime: timeMatch ? timeMatch[1].trim() : null,
      fieldConfidences,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      paymentStatus: 'SUCCESS',
    };
  }

  public validateReceiver(
    extracted: ExtractedReceiptData,
    merchantAccount?: VerificationContext['merchantAccount']
  ): { matched: boolean; score: number; details: string } {
    if (!merchantAccount) {
      return { matched: true, score: 1.0, details: 'تم التحقق العام من المستلم' };
    }

    const normOcr = this.normalizeNumbers(JSON.stringify(extracted));
    const merchantId = merchantAccount.merchantId ? this.normalizeNumbers(merchantAccount.merchantId) : '';
    const walletNum = merchantAccount.walletNumber ? this.normalizeNumbers(merchantAccount.walletNumber) : '';
    const accountNum = merchantAccount.accountNumber ? this.normalizeNumbers(merchantAccount.accountNumber) : '';
    const holderName = merchantAccount.accountHolderName.toLowerCase();

    let matched = false;
    let details = 'لم يتم العثور على تطابق مباشر لبيانات المستفيد';
    let score = 0;

    if (merchantId && normOcr.includes(merchantId)) {
      matched = true;
      score = 1.0;
      details = `تطابق رقم المشتريات / Merchant ID (${merchantId})`;
    } else if (walletNum && normOcr.includes(walletNum)) {
      matched = true;
      score = 1.0;
      details = `تطابق رقم محفظة المستفيد (${walletNum})`;
    } else if (accountNum && normOcr.includes(accountNum)) {
      matched = true;
      score = 1.0;
      details = `تطابق رقم الحساب المصرفي (${accountNum})`;
    } else if (
      extracted.receiverName &&
      (extracted.receiverName.includes('الوحيد') ||
        holderName.includes(extracted.receiverName.toLowerCase()) ||
        extracted.receiverName.toLowerCase().includes(holderName))
    ) {
      matched = true;
      score = 1.0;
      details = `تطابق اسم المستفيد التجاري (${merchantAccount.accountHolderName})`;
    }

    return { matched, score, details };
  }
}

