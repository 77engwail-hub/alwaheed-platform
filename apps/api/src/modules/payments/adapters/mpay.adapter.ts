import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class MPayAdapter extends BasePaymentAdapter {
  readonly providerCode = 'MPAY';
  readonly providerNameAr = 'إم بي المتكاملة';
  readonly providerNameEn = 'mPay';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    const norm = this.normalizeNumbers(ocrText);
    const mpayRef = norm.match(/(?:رقم العملية|إم بي|MPAY)[:#-]?\s*([0-9]{6,16})/i);
    if (mpayRef && mpayRef[1]) {
      data.referenceNumber = mpayRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.95 };
    }

    return data;
  }
}
