import type {
  GeneratedCaseMeta,
  GroundTruthOutcome,
  Severity,
  SimulationConfig,
  SubmitReportInput
} from '$lib/domains/types';
import { simulationTemplates, type SimulationTemplate } from './simulation-templates';

export const defaultSimulationConfig: SimulationConfig = {
  ratePerMinute: 4,
  maliciousRatio: 0.6,
  severityMix: {
    low: 20,
    medium: 35,
    high: 30,
    critical: 15
  },
  seed: 42,
  autoStartOnReset: false
};

type SyntheticReport = {
  input: SubmitReportInput;
  meta: Omit<GeneratedCaseMeta, 'reportId' | 'alertId'>;
};

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function pickSeverity(config: SimulationConfig, random: () => number): Severity {
  const threshold = random() * 100;
  let cursor = 0;
  const entries = Object.entries(config.severityMix) as Array<[Severity, number]>;

  for (const [severity, share] of entries) {
    cursor += share;
    if (threshold <= cursor) {
      return severity;
    }
  }

  return 'medium';
}

function pickTemplate(outcome: GroundTruthOutcome, random: () => number): SimulationTemplate {
  const templates = simulationTemplates.filter((template) => template.outcome === outcome);
  return pick(templates, random);
}

export function generateSyntheticReport(
  config: SimulationConfig,
  now: string,
  sequence: number
): SyntheticReport {
  const random = seededRandom(config.seed + sequence * 9973);
  const outcome: GroundTruthOutcome = random() < config.maliciousRatio ? 'malicious' : 'safe';
  const severity = pickSeverity(config, random);
  const template = pickTemplate(outcome, random);

  return {
    input: {
      sender: template.sender,
      subject: `${template.subject} #${sequence + 1}`,
      receivedAt: now,
      reason: template.reason,
      riskyActions: template.riskyActions,
      messagePreview: template.messagePreview
    },
    meta: {
      generatedAt: now,
      templateId: template.id,
      groundTruth: {
        outcome,
        severity
      }
    }
  };
}
