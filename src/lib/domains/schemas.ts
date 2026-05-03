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