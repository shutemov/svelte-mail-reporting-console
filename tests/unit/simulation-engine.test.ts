import { describe, expect, it } from 'vitest';
import { generateSyntheticReport, pickSimulationReporter } from '$lib/server/simulation-engine';
import type { DemoUser, SimulationConfig } from '$lib/domains';

const config: SimulationConfig = {
  ratePerMinute: 5,
  maliciousRatio: 0.5,
  severityMix: {
    low: 25,
    medium: 25,
    high: 25,
    critical: 25
  },
  seed: 123,
  autoStartOnReset: false
};

describe('simulation engine', () => {
  it('generates deterministic synthetic reports for a fixed seed and sequence', () => {
    const first = generateSyntheticReport(config, '2026-01-01T00:00:00.000Z', 3);
    const second = generateSyntheticReport(config, '2026-01-01T00:00:00.000Z', 3);

    expect(second).toEqual(first);
  });

  it('picks reporters deterministically from employees', () => {
    const users: DemoUser[] = [
      { id: 'employee-1', role: 'employee', name: 'Alice Employee' },
      { id: 'employee-2', role: 'employee', name: 'Bob Employee' },
      { id: 'admin-1', role: 'admin', name: 'Ada Admin' }
    ];

    expect(pickSimulationReporter(users, config, 0)?.id).toBe('employee-2');
    expect(pickSimulationReporter(users, config, 1)?.id).toBe('employee-1');
    expect(pickSimulationReporter(users, config, 0)?.id).toBe('employee-2');
  });
});
