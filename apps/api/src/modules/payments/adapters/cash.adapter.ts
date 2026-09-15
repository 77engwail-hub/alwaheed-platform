import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class CashAdapter extends BasePaymentAdapter {
  readonly providerCode = 'CASH';
  readonly providerNameAr = 'كاش';
  readonly providerNameEn = 'Cash';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    const norm = this.normalizeNumbers(ocrText);
    const cashRef = norm.match(/(?:رقم العملية|رقم القيد|كاش|CASH-REF)[:#-]?\s*([0-9A-Za-z]{6,20})/i);
    if (cashRef && cashRef[1]) {
      data.referenceNumber = cashRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.95 };
    }

    return data;
  }
}
