import { z } from 'zod';

export const riskyActionSchema = z.enum([
  'opened_email',
  'clicked_link',
  'downloaded_attachment',
  'entered_credentials',
  'reported_without_interaction'
]);
export type RiskyAction = z.infer<typeof riskyActionSchema>;

export const reportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  sender: z.string(),
  subject: z.string(),
  receivedAt: z.string(),
  reason: z.string(),
  riskyActions: z.array(riskyActionSchema),
  messagePreview: z.string().optional(),
  createdAt: z.string(),
  alertId: z.string()
});
export type Report = z.infer<typeof reportSchema>;

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
export type SubmitReportInput = z.infer<typeof submitReportSchema>;
