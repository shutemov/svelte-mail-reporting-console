import { describe, expect, it } from 'vitest';
import { measure, expectWithinBudget } from '../utils/performance';
import { calculateSeverity } from '$lib/domains/risk';
import { buildDashboardSummary } from '$lib/domains/dashboard';
import { InMemoryMockRepository } from '$lib/server/mock-repository';

describe('performance budgets', () => {
  it('risk scoring under 5ms', async () => {
    const result = await measure('risk', () => {
      for (let i = 0; i < 5000; i += 1) {
        calculateSeverity(['opened_email', 'clicked_link']);
      }
    });

    expectWithinBudget('risk scoring', result.durationMs, 5);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('dashboard aggregation under 20ms', async () => {
    const repository = new InMemoryMockRepository('default');
    const state = repository.getCurrentState();

    const result = await measure('dashboard', () => {
      for (let i = 0; i < 1000; i += 1) {
        buildDashboardSummary(state);
      }
    });

    expectWithinBudget('dashboard', result.durationMs, 20);
  });

  it('alert filtering under 20ms', async () => {
    const repository = new InMemoryMockRepository('default');

    const result = await measure('filtering', () => {
      for (let i = 0; i < 500; i += 1) {
        repository.listAlerts({ status: 'investigating' });
      }
    });

    expectWithinBudget('alert filtering', result.durationMs, 20);
  });
});
