import { describe, expect, it } from 'vitest';
import { simulationConfigSchema, submitReportSchema } from '$lib/domains/schemas';

describe('submitReportSchema', () => {
  it('validates required fields', () => {
    const parsed = submitReportSchema.safeParse({
      sender: '',
      subject: '',
      receivedAt: 'invalid',
      reason: '',
      riskyActions: []
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects reported_without_interaction combo', () => {
    const parsed = submitReportSchema.safeParse({
      sender: 'sender@example.com',
      subject: 'subject',
      receivedAt: '2026-01-01T00:00:00.000Z',
      reason: 'Valid reason',
      riskyActions: ['reported_without_interaction', 'clicked_link']
    });

    expect(parsed.success).toBe(false);
  });
});

describe('simulationConfigSchema', () => {
  it('accepts guarded simulation config', () => {
    const parsed = simulationConfigSchema.safeParse({
      ratePerMinute: '10',
      maliciousRatio: '0.55',
      severityMix: {
        low: '20',
        medium: '30',
        high: '30',
        critical: '20'
      },
      seed: '7',
      autoStartOnReset: 'on'
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects invalid severity mix totals', () => {
    const parsed = simulationConfigSchema.safeParse({
      ratePerMinute: 10,
      maliciousRatio: 0.5,
      severityMix: {
        low: 10,
        medium: 10,
        high: 10,
        critical: 10
      },
      seed: 7,
      autoStartOnReset: false
    });

    expect(parsed.success).toBe(false);
  });
});
