import type { PaymentProviderAdapter } from './payment-provider.interface.js';
import { OneCashAdapter } from './one-cash.adapter.js';
import { JawaliAdapter } from './jawali.adapter.js';
import { FloosakAdapter } from './floosak.adapter.js';
import { CashAdapter } from './cash.adapter.js';
import { SabaCashAdapter } from './sabacash.adapter.js';
import { CACMobileMoneyAdapter } from './cac-mobily.adapter.js';
import { MPayAdapter } from './mpay.adapter.js';
import { ManualWalletAdapter } from './manual-wallet.adapter.js';

export class PaymentAdapterFactory {
  private static adapters: Map<string, PaymentProviderAdapter> = new Map();

  static {
    this.register(new OneCashAdapter());
    this.register(new JawaliAdapter());
    this.register(new FloosakAdapter());
    this.register(new CashAdapter());
    this.register(new SabaCashAdapter());
    this.register(new CACMobileMoneyAdapter());
    this.register(new MPayAdapter());
    this.register(new ManualWalletAdapter());
  }

  public static register(adapter: PaymentProviderAdapter): void {
    this.adapters.set(adapter.providerCode.toUpperCase(), adapter);
  }

  public static getAdapter(providerCode: string): PaymentProviderAdapter {
    const key = (providerCode || 'MANUAL_WALLET').toUpperCase();
    return this.adapters.get(key) || this.adapters.get('MANUAL_WALLET') || new ManualWalletAdapter();
  }

  public static getAllAdapters(): PaymentProviderAdapter[] {
    return Array.from(this.adapters.values());
  }
}
