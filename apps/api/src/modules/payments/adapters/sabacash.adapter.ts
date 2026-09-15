import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class SabaCashAdapter extends BasePaymentAdapter {
  readonly providerCode = 'SABA_CASH';
  readonly providerNameAr = 'سبأكاش';
  readonly providerNameEn = 'SabaCash';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    const norm = this.normalizeNumbers(ocrText);
    const sabaRef = norm.match(/(?:رقم السند|سبأكاش|SABACASH|رقم العملية)[:#-]?\s*([0-9]{6,16})/i);
    if (sabaRef && sabaRef[1]) {
      data.referenceNumber = sabaRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.95 };
    }

    return data;
  }
}
