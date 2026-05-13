import { z } from 'zod';
import { groundTruthOutcomeSchema, severitySchema } from '../alert/models';

function formNumber(schema: z.ZodNumber) {
  return z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }, schema);
}

export const simulationModeSchema = z.enum(['paused', 'running']);
export type SimulationMode = z.infer<typeof simulationModeSchema>;

export const severityMixSchema = z.object({
  low: z.number(),
  medium: z.number(),
  high: z.number(),
  critical: z.number()
});
export type SeverityMix = z.infer<typeof severityMixSchema>;

export const simulationSeverityMixSchema = z.object({
  low: formNumber(z.number().int('Low severity share must be a whole number').min(0).max(100)),
  medium: formNumber(
    z.number().int('Medium severity share must be a whole number').min(0).max(100)
  ),
  high: formNumber(z.number().int('High severity share must be a whole number').min(0).max(100)),
  critical: formNumber(
    z.number().int('Critical severity share must be a whole number').min(0).max(100)
  )
});

export const simulationConfigSchema = z
  .object({
    ratePerMinute: formNumber(
      z
        .number()
        .int('Rate must be a whole number')
        .min(1, 'Rate must be at least 1 per minute')
        .max(20, 'Rate must be 20 per minute or lower')
    ),
    maliciousRatio: formNumber(
      z
        .number()
        .min(0, 'Malicious ratio cannot be negative')
        .max(1, 'Malicious ratio cannot be greater than 1')
    ),
    severityMix: simulationSeverityMixSchema,
    seed: formNumber(z.number().int('Seed must be a whole number')),
    autoStartOnReset: z.preprocess((value) => value === 'on' || value === true, z.boolean())
  })
  .superRefine((value, ctx) => {
    const total =
      value.severityMix.low +
      value.severityMix.medium +
      value.severityMix.high +
      value.severityMix.critical;

    if (total !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Severity mix must add up to 100%',
        path: ['severityMix']
      });
    }
  });
export type SimulationConfig = z.infer<typeof simulationConfigSchema>;

export const generatedCaseMetaSchema = z.object({
  reportId: z.string(),
  alertId: z.string(),
  generatedAt: z.string(),
  templateId: z.string(),
  groundTruth: z.object({
    outcome: groundTruthOutcomeSchema,
    severity: severitySchema
  })
});
export type GeneratedCaseMeta = z.infer<typeof generatedCaseMetaSchema>;

export const simulationSessionSchema = z.object({
  mode: simulationModeSchema,
  config: simulationConfigSchema,
  generatedCount: z.number(),
  startedAt: z.string().optional(),
  lastGeneratedAt: z.string().optional()
});
export type SimulationSession = z.infer<typeof simulationSessionSchema>;

export const queueHealthMetricsSchema = z.object({
  openAlerts: z.number(),
  newAlertsLast15m: z.number(),
  backlogGrowthRate: z.number(),
  oldestOpenAlertMinutes: z.number().nullable()
});
export type QueueHealthMetrics = z.infer<typeof queueHealthMetricsSchema>;

export const triageOutcomeMetricsSchema = z.object({
  totalDecisions: z.number(),
  correctDecisions: z.number(),
  falsePositives: z.number(),
  falseNegatives: z.number(),
  decisionAccuracyPercent: z.number(),
  falsePositiveRate: z.number(),
  falseNegativeRate: z.number(),
  precisionPercent: z.number(),
  recallPercent: z.number(),
  medianTimeToFirstActionMinutes: z.number().nullable(),
  medianTimeToResolutionMinutes: z.number().nullable(),
  alertsResolvedLastHour: z.number()
});
export type TriageOutcomeMetrics = z.infer<typeof triageOutcomeMetricsSchema>;

export const humanRiskLearningMetricsSchema = z.object({
  highRiskActionRate: z.number(),
  learningAssignmentRateForEligibleCases: z.number(),
  learningCompletionRate: z.number()
});
export type HumanRiskLearningMetrics = z.infer<typeof humanRiskLearningMetricsSchema>;

export const simulationSummarySchema = z.object({
  session: simulationSessionSchema,
  generatedCases: z.array(generatedCaseMetaSchema),
  queueHealth: queueHealthMetricsSchema,
  triageOutcome: triageOutcomeMetricsSchema,
  humanRiskLearning: humanRiskLearningMetricsSchema
});
export type SimulationSummary = z.infer<typeof simulationSummarySchema>;
