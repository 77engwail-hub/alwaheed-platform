import { describe, it, expect } from 'vitest';
import { QuotationStateMachine } from '../src/modules/quotations/quotation-state-machine.js';

describe('QuotationStateMachine', () => {
  it('should allow valid transitions from NEW to UNDER_REVIEW and REJECTED', () => {
    expect(QuotationStateMachine.canTransition('NEW', 'UNDER_REVIEW')).toBe(true);
    expect(QuotationStateMachine.canTransition('NEW', 'REJECTED')).toBe(true);
  });

  it('should disallow invalid transition from NEW directly to ACCEPTED or CONVERTED_TO_ORDER', () => {
    expect(QuotationStateMachine.canTransition('NEW', 'ACCEPTED')).toBe(false);
    expect(QuotationStateMachine.canTransition('NEW', 'CONVERTED_TO_ORDER')).toBe(false);
  });

  it('should allow transition sequence: NEW -> UNDER_REVIEW -> PRICED -> SENT -> ACCEPTED -> CONVERTED_TO_ORDER', () => {
    expect(QuotationStateMachine.canTransition('NEW', 'UNDER_REVIEW')).toBe(true);
    expect(QuotationStateMachine.canTransition('UNDER_REVIEW', 'PRICED')).toBe(true);
    expect(QuotationStateMachine.canTransition('PRICED', 'SENT')).toBe(true);
    expect(QuotationStateMachine.canTransition('SENT', 'ACCEPTED')).toBe(true);
    expect(QuotationStateMachine.canTransition('ACCEPTED', 'CONVERTED_TO_ORDER')).toBe(true);
  });

  it('should throw an error on illegal state jump', () => {
    expect(() => {
      QuotationStateMachine.validateTransition('ACCEPTED', 'NEW');
    }).toThrow();
  });
});
