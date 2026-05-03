import { describe, expect, it } from 'vitest';
import { calculateSeverity, validateRiskyActionCombination } from '$lib/domains/risk-scoring';

describe('risk-scoring', () => {
  it('returns expected severity by action', () => {
    expect(calculateSeverity(['reported_without_interaction'])).toBe('low');
    expect(calculateSeverity(['opened_email'])).toBe('low');
    expect(calculateSeverity(['clicked_link'])).toBe('high');
    expect(calculateSeverity(['downloaded_attachment'])).toBe('high');
    expect(calculateSeverity(['entered_credentials'])).toBe('critical');
  });

  it('returns max severity for multiple actions', () => {
    expect(calculateSeverity(['opened_email', 'clicked_link', 'entered_credentials'])).toBe(
      'critical'
    );
  });

  it('rejects invalid combination', () => {
    expect(
      validateRiskyActionCombination(['reported_without_interaction', 'clicked_link'])
    ).toContain('cannot be combined');
  });
});