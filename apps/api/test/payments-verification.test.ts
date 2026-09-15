import { describe, it, expect, beforeEach } from 'vitest';
import { PaymentAdapterFactory } from '../src/modules/payments/adapters/adapter.factory.js';
import { OneCashAdapter } from '../src/modules/payments/adapters/one-cash.adapter.js';
import { FloosakAdapter } from '../src/modules/payments/adapters/floosak.adapter.js';
import { JawaliAdapter } from '../src/modules/payments/adapters/jawali.adapter.js';
import { ImageHasherService } from '../src/modules/payments/services/image-hasher.service.js';
import { ReceiptAnalyzerService } from '../src/modules/payments/services/receipt-analyzer.service.js';
import { PaymentMatcherService } from '../src/modules/payments/services/payment-matcher.service.js';

describe('🏛️ Yemeni Wallets & AI Payment Verification Engine Tests', () => {
  const merchantAccount = {
    accountNumber: '12089456',
    walletNumber: '777360681',
    merchantId: '889201',
    merchantPaymentNumber: '889201',
    accountHolderName: 'مؤسسة الوحيد للزخرفة المعمارية',
  };

  describe('1. Number Normalization & Regex Token Extraction', () => {
    const adapter = new OneCashAdapter();

    it('should normalize Eastern Arabic / Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard digits', () => {
      const arabicNumbers = 'المبلغ: ٢٥٠٠٠ ر.ي الرقم المرجعي: ٨٨٩٢٠١';
      const normalized = adapter.normalizeNumbers(arabicNumbers);
      expect(normalized).toContain('25000');
      expect(normalized).toContain('889201');
    });

    it('should parse amounts correctly with commas, currencies, and decimals', () => {
      const sample1 = 'المبلغ المدفوع: 150,000 YER بنجاح';
      const parsed1 = adapter.parseAmountFromText(sample1);
      expect(parsed1.amount).toBe(150000);
      expect(parsed1.confidence).toBeGreaterThan(0.9);

      const sample2 = 'القيمة: 75,500.50 ريال';
      const parsed2 = adapter.parseAmountFromText(sample2);
      expect(parsed2.amount).toBe(75500.5);

      const sample3 = 'تم سداد مبلغ ٢٥,٠٠٠ ر.ي';
      const parsed3 = adapter.parseAmountFromText(sample3);
      expect(parsed3.amount).toBe(25000);
    });

    it('should extract transaction reference numbers cleanly', () => {
      const sample = 'رقم العملية: ONECASH-98421054 تاريخ السداد: 2026-09-15';
      const parsed = adapter.parseReferenceNumber(sample);
      expect(parsed.reference).toBe('ONECASH-98421054');
    });
  });

  describe('2. Provider Specific Adapters (OneCash, Floosak, Jawali)', () => {
    it('should extract OneCash specific merchant ID and reference', () => {
      const adapter = PaymentAdapterFactory.getAdapter('ONE_CASH');
      const text = `
        إشعار سداد ون كاش
        المستفيد: مؤسسة الوحيد للزخرفة المعمارية
        رقم المشتريات: 889201
        المبلغ: 100,000 ريال يمني
        رقم الحركة: OC-4491028
        التاريخ: 2026-09-15
      `;
      const data = adapter.parseReceiptText(text);
      expect(data.walletProvider).toBe('ONE_CASH');
      expect(data.amount).toBe(100000);
      expect(data.merchantId).toBe('889201');
      expect(data.referenceNumber).toBe('OC-4491028');

      const receiverCheck = adapter.validateReceiver(data, merchantAccount);
      expect(receiverCheck.matched).toBe(true);
      expect(receiverCheck.score).toBe(1.0);
    });

    it('should extract Floosak / Kuraimi account details', () => {
      const adapter = PaymentAdapterFactory.getAdapter('FLOOSAK');
      const text = `
        بنك الكريمي للتمويل الأصغر الإسلامي
        إشعار تحويل فلوسك
        إلى حساب: 12089456
        المستفيد: مؤسسة الوحيد للزخرفة والنحت
        المبلغ: 50,000 ريال
        رقم الحوالة: 789456123
      `;
      const data = adapter.parseReceiptText(text);
      expect(data.walletProvider).toBe('FLOOSAK');
      expect(data.amount).toBe(50000);
      expect(data.referenceNumber).toBe('789456123');

      const receiverCheck = adapter.validateReceiver(data, merchantAccount);
      expect(receiverCheck.matched).toBe(true);
    });

    it('should extract Jawali wallet transfer details', () => {
      const adapter = PaymentAdapterFactory.getAdapter('JAWALI');
      const text = `
        محفظة جوالي - بنك اليمن والكويت
        المستفيد: مؤسسة الوحيد للأحجار
        رقم المشترك: 777360681
        المبلغ: 30,000 YER
        رقم السند: 994821
      `;
      const data = adapter.parseReceiptText(text);
      expect(data.walletProvider).toBe('JAWALI');
      expect(data.amount).toBe(30000);
      expect(data.receiverWalletNumber).toBe('777360681');

      const receiverCheck = adapter.validateReceiver(data, merchantAccount);
      expect(receiverCheck.matched).toBe(true);
    });
  });

  describe('3. Duplicate Detection & Perceptual Hashing', () => {
    it('should compute SHA-256 and detect binary duplicates', () => {
      const buffer1 = Buffer.from('receipt_image_binary_data_123');
      const buffer2 = Buffer.from('receipt_image_binary_data_123');
      const buffer3 = Buffer.from('receipt_image_binary_data_different');

      const hash1 = ImageHasherService.computeSha256(buffer1);
      const hash2 = ImageHasherService.computeSha256(buffer2);
      const hash3 = ImageHasherService.computeSha256(buffer3);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
    });

    it('should compute perceptual hash and calculate Hamming distance', () => {
      const buffer = Buffer.alloc(1024);
      for (let i = 0; i < 1024; i++) buffer[i] = i % 256;

      const pHash1 = ImageHasherService.computePerceptualHash(buffer);
      const pHash2 = ImageHasherService.computePerceptualHash(buffer);

      expect(pHash1.length).toBe(16);
      expect(ImageHasherService.calculateHammingDistance(pHash1, pHash2)).toBe(0);
    });
  });

  describe('4. Intelligent Scoring & AI Recommendations Engine', () => {
    it('Exact Match: should return score >= 90 and ACCEPT recommendation', () => {
      const extracted = {
        walletProvider: 'ONE_CASH',
        amount: 150000,
        currency: 'YER',
        referenceNumber: 'REF-984210',
        receiverName: 'مؤسسة الوحيد للزخرفة المعمارية',
        transactionDate: '2026-09-15',
        averageConfidence: 0.95,
      };

      const result = PaymentMatcherService.evaluatePayment(extracted, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'ONE_CASH',
        merchantAccount,
      });

      expect(result.totalScore).toBeGreaterThanOrEqual(90);
      expect(result.recommendation).toBe('ACCEPT');
      expect(result.amountMatchScore).toBe(30);
      expect(result.receiverMatchScore).toBe(25);
    });

    it('Partial Payment: should return PARTIAL_PAYMENT recommendation when paid < order', () => {
      const extracted = {
        walletProvider: 'FLOOSAK',
        amount: 100000,
        currency: 'YER',
        referenceNumber: 'REF-554433',
        receiverName: 'مؤسسة الوحيد للزخرفة',
        transactionDate: '2026-09-15',
        averageConfidence: 0.9,
      };

      const result = PaymentMatcherService.evaluatePayment(extracted, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'FLOOSAK',
        merchantAccount,
      });

      expect(result.recommendation).toBe('PARTIAL_PAYMENT');
      expect(result.amountMatchScore).toBeLessThan(30);
      expect(result.amountMatchScore).toBeGreaterThan(10);
    });

    it('Overpayment: should return OVERPAYMENT recommendation when paid > order', () => {
      const extracted = {
        walletProvider: 'ONE_CASH',
        amount: 160000,
        currency: 'YER',
        referenceNumber: 'REF-778899',
        receiverName: 'مؤسسة الوحيد',
        transactionDate: '2026-09-15',
        averageConfidence: 0.92,
      };

      const result = PaymentMatcherService.evaluatePayment(extracted, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'ONE_CASH',
        merchantAccount,
      });

      expect(result.recommendation).toBe('OVERPAYMENT');
    });

    it('Wrong Receiver: should drop receiver score to 0 and flag RECEIVER_MISMATCH', () => {
      const extracted = {
        walletProvider: 'ONE_CASH',
        amount: 150000,
        currency: 'YER',
        referenceNumber: 'REF-112233',
        receiverName: 'شركة أخرى مختلفة تماماً',
        transactionDate: '2026-09-15',
        averageConfidence: 0.9,
      };

      const result = PaymentMatcherService.evaluatePayment(extracted, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'ONE_CASH',
        merchantAccount,
      });

      expect(result.receiverMatchScore).toBe(0);
      expect(result.integrityFlags).toContain('RECEIVER_MISMATCH');
      expect(result.recommendation).toBe('MANUAL_REVIEW');
    });

    it('Duplicate Image / Hash Collision: should flag SUSPICIOUS and cap score at <= 40', () => {
      const extracted = {
        walletProvider: 'ONE_CASH',
        amount: 150000,
        currency: 'YER',
        referenceNumber: 'REF-999999',
        receiverName: 'مؤسسة الوحيد',
        transactionDate: '2026-09-15',
        averageConfidence: 0.95,
      };

      const result = PaymentMatcherService.evaluatePayment(extracted, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'ONE_CASH',
        merchantAccount,
        isDuplicateImage: true,
      });

      expect(result.recommendation).toBe('SUSPICIOUS');
      expect(result.totalScore).toBeLessThanOrEqual(40);
      expect(result.integrityFlags).toContain('DUPLICATE_IMAGE_DETECTED');
    });

    it('Unreadable / Blurry Receipt: should return MANUAL_REVIEW', () => {
      const { extractedData } = ReceiptAnalyzerService.analyzeReceiptText('');
      const result = PaymentMatcherService.evaluatePayment(extractedData, {
        expectedAmount: 150000,
        currency: 'YER',
        providerCode: 'MANUAL_WALLET',
        merchantAccount,
      });

      expect(result.recommendation).toBe('MANUAL_REVIEW');
      expect(result.totalScore).toBeLessThan(60);
    });
  });
});
