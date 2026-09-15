import { BasePaymentAdapter } from './base.adapter.js';
import type { ExtractedReceiptData } from '@al-waheed/types';

export class JawaliAdapter extends BasePaymentAdapter {
  readonly providerCode = 'JAWALI';
  readonly providerNameAr = 'جوالي';
  readonly providerNameEn = 'Jawali';

  public override parseReceiptText(ocrText: string): ExtractedReceiptData {
    const data = super.parseReceiptText(ocrText);
    data.walletProvider = this.providerCode;

    // Jawali specific keywords (e.g. خدمة جوالي، بنك اليمن والكويت، وي كاش، إشعار سداد مشتريات)
    const norm = this.normalizeNumbers(ocrText);
    const jawaliRef = norm.match(/(?:رقم السند|رقم العملية|رقم الإشعار|JAWALI)[:#-]?\s*([0-9]{6,16})/i);
    if (jawaliRef && jawaliRef[1]) {
      data.referenceNumber = jawaliRef[1].trim();
      data.fieldConfidences = { ...(data.fieldConfidences || {}), referenceNumber: 0.96 };
    }

    const jawaliPhone = norm.match(/(?:رقم المشترك|رقم جوالي|هاتف المستفيد)\s*[:=]?\s*([0-9]{9})/i);
    if (jawaliPhone && jawaliPhone[1]) {
      data.receiverWalletNumber = jawaliPhone[1].trim();
    }

    return data;
  }
}
