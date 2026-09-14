import { describe, it, expect } from 'vitest';
import { formatPrice, formatPricingMode, formatUnit } from '@al-waheed/ui';

describe('Pricing and Unit Formatting', () => {
  it('should correctly format fixed prices in YER', () => {
    const formatted = formatPrice(180000, 'YER', 'FIXED_PRICE');
    expect(formatted).toContain('ريال يمني');
  });

  it('should format starting from prices', () => {
    const formatted = formatPrice(650000, 'YER', 'STARTING_FROM');
    expect(formatted).toContain('يبدأ من');
    expect(formatted).toContain('ريال يمني');
  });

  it('should handle CONTACT_FOR_PRICE mode gracefully', () => {
    const formatted = formatPrice(null, 'YER', 'CONTACT_FOR_PRICE');
    expect(formatted).toBe('السعر عند الطلب');
  });

  it('should handle CUSTOM_QUOTE mode', () => {
    const formatted = formatPrice(null, 'YER', 'CUSTOM_QUOTE');
    expect(formatted).toBe('حسب أبعاد ونوع النقش');
  });

  it('should format units correctly in Arabic', () => {
    expect(formatUnit('SQUARE_METER')).toBe('متر مربع (m²)');
    expect(formatUnit('PIECE')).toBe('قطعة');
    expect(formatUnit('LINEAR_METER')).toBe('متر طولي (m)');
  });
});
