import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class FloosakAdapter extends BasePaymentAdapter {
  readonly providerCode = 'FLOOSAK';
  readonly providerNameAr = 'فلوسك';
  readonly providerNameEn = 'Floosak';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    // Floosak specific (بنك الكريمي، حساب مميز، فلوسك، حوالة كريمي إكسبرس)
    const norm = this.normalizeNumbers(ocrText);
    const floosakRef = norm.match(/(?:رقم الحوالة|رقم الإشعار|رقم القيد|FLOOSAK)[:#-]?\s*([0-9]{7,18})/i);
    if (floosakRef && floosakRef[1]) {
      data.referenceNumber = floosakRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.97 };
    }

    const accountMatch = norm.match(/(?:رقم الحساب المميز|حساب الكريمي|إلى حساب)\s*[:=]?\s*([0-9]{6,12})/i);
    if (accountMatch && accountMatch[1]) {
      data.receiverWalletNumber = accountMatch[1].trim();
    }

    return data;
  }
}
