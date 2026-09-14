import type { QuotationStatus } from '@al-waheed/types';

export class QuotationStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
    NEW: ['UNDER_REVIEW', 'REJECTED'],
    UNDER_REVIEW: ['NEED_MORE_INFO', 'PRICED', 'REJECTED'],
    NEED_MORE_INFO: ['UNDER_REVIEW', 'REJECTED'],
    PRICED: ['SENT', 'UNDER_REVIEW', 'REJECTED'],
    SENT: ['ACCEPTED', 'REJECTED', 'EXPIRED'],
    ACCEPTED: ['CONVERTED_TO_ORDER'],
    REJECTED: [],
    EXPIRED: ['UNDER_REVIEW'], // Can be reopened
    CONVERTED_TO_ORDER: [],
  };

  public static canTransition(current: QuotationStatus, target: QuotationStatus): boolean {
    if (current === target) return true;
    const allowed = this.ALLOWED_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  public static validateTransition(current: QuotationStatus, target: QuotationStatus) {
    if (!this.canTransition(current, target)) {
      throw new Error(
        `الانتقال غير مسموح به من الحالة [${current}] إلى الحالة [${target}] وفق معايير دورة حياة طلبات عروض الأسعار`
      );
    }
  }
}
