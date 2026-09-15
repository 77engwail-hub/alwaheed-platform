import { BasePaymentAdapter } from './base.adapter.js';

export class ManualWalletAdapter extends BasePaymentAdapter {
  readonly providerCode = 'MANUAL_WALLET';
  readonly providerNameAr = 'محفظة أو تحويل يدوي مخصص';
  readonly providerNameEn = 'Custom Wallet / Transfer';
}
