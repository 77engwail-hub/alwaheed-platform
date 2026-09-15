import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class OneCashAdapter extends BasePaymentAdapter {
  readonly providerCode = 'ONE_CASH';
  readonly providerNameAr = 'ون كاش';
  readonly providerNameEn = 'ONE Cash';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    // OneCash specific keywords (e.g. خدمة ون كاش، البنك التجاري اليمني، نقطة بيع ون كاش، رقم الحركة)
    const norm = this.normalizeNumbers(ocrText);
    const oneCashRef = norm.match(/(?:رقم الحركة|رقم إشعار ون كاش|ONECASH-REF|ONECASH)[:#-]?\s*([A-Za-z0-9\-_]{6,25})/i);
    if (oneCashRef && oneCashRef[1]) {
      data.referenceNumber = oneCashRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.98 };
    }

    const merchantMatch = norm.match(/(?:رقم المشتريات|رمز التاجر|Merchant Code|كود ون كاش)\s*[:=]?\s*([0-9]{4,10})/i);
    if (merchantMatch && merchantMatch[1]) {
      data.merchantId = merchantMatch[1].trim();
    }

    return data;
  }
}
