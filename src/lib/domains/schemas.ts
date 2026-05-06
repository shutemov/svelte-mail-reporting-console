import { z } from 'zod';

const riskyActionValues = [
  'opened_email',
  'clicked_link',
  'downloaded_attachment',
  'entered_credentials',
  'reported_without_interaction'
] as const;

export const riskyActionSchema = z.enum(riskyActionValues);

export const submitReportSchema = z
  .object({
    sender: z.string().min(3, 'Sender is required').max(200),
    subject: z.string().min(3, 'Subject is required').max(200),
    receivedAt: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Received date is invalid'),
    reason: z.string().min(5, 'Reason is required').max(800),
    riskyActions: z.array(riskyActionSchema).min(1, 'Select at least one action'),
    messagePreview: z.string().max(5000).optional().or(z.literal(''))
  })
  .superRefine((value, ctx) => {
    if (
      value.riskyActions.includes('reported_without_interaction') &&
      value.riskyActions.length > 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Reported without interaction cannot be combined with other actions',
        path: ['riskyActions']
      });
    }
  });

export const alertCommandSchema = z.object({
  command: z.enum([
    'startInvestigation',
    'resolveAsSafe',
    'resolveAsMalicious',
    'closeAlert'
  ]),
  resolutionNote: z.string().max(1000).optional()
});

export const addInvestigationNoteSchema = z.object({
  body: z.string().min(2, 'Note is required').max(1000)
});

export const assignLearningSchema = z.object({
  moduleId: z.literal('phishing-basics')
});

export const completeLearningSchema = z.object({
  assignmentId: z.string().min(1)
});

export const alertListQuerySchema = z.object({
  status: z
    .enum(['new', 'investigating', 'resolved_safe', 'resolved_malicious', 'closed'])
    .optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  reporterId: z.string().min(1).optional(),
  riskyAction: riskyActionSchema.optional()
});

export const demoUserRoleSchema = z.enum(['employee', 'admin', 'viewer']);

export const failNextSchema = z.object({
  command: z.enum(['submitReport', 'updateAlertStatus', 'assignLearning', 'completeLearning']),
  status: z.number().int().min(400).max(599),
  message: z.string().min(1)
});

function formNumber(schema: z.ZodNumber) {
  return z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }, schema);
}

const simulationSeverityMixSchema = z.object({
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
