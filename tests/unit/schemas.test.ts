import { describe, expect, it } from 'vitest';
import { submitReportSchema } from '$lib/domains/schemas';

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