import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class CACMobileMoneyAdapter extends BasePaymentAdapter {
  readonly providerCode = 'CAC_MOBILY';
  readonly providerNameAr = 'موبايل موني - كاك بنك';
  readonly providerNameEn = 'CAC Mobile Money';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    const norm = this.normalizeNumbers(ocrText);
    const cacRef = norm.match(/(?:رقم المرجع|رقم الإشعار|كاك بنك|CAC-MOBILY)[:#-]?\s*([0-9]{6,18})/i);
    if (cacRef && cacRef[1]) {
      data.referenceNumber = cacRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.96 };
    }

    return data;
  }
}
