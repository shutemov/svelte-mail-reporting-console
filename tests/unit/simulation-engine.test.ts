import { describe, expect, it } from 'vitest';
import { generateSyntheticReport } from '$lib/server/simulation-engine';
import type { SimulationConfig } from '$lib/domains/types';

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
});
