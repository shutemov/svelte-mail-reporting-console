import { z } from 'zod';
import { riskyActionSchema } from '../report/models';

export const alertStatusSchema = z.enum([
  'new',
  'investigating',
  'resolved_safe',
  'resolved_malicious',
  'closed'
]);
export type AlertStatus = z.infer<typeof alertStatusSchema>;

export const severitySchema = z.enum(['low', 'medium', 'high', 'critical']);
export type Severity = z.infer<typeof severitySchema>;

export const groundTruthOutcomeSchema = z.enum(['safe', 'malicious']);
export type GroundTruthOutcome = z.infer<typeof groundTruthOutcomeSchema>;

export const alertSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  reporterId: z.string(),
  status: alertStatusSchema,
  severity: severitySchema,
  finalOutcome: groundTruthOutcomeSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().optional()
});
export type Alert = z.infer<typeof alertSchema>;

export const alertCommandValueSchema = z.enum([
  'startInvestigation',
  'resolveAsSafe',
  'resolveAsMalicious',
  'closeAlert'
]);
export type AlertCommand = z.infer<typeof alertCommandValueSchema>;

export const alertCommandSchema = z.object({
  command: alertCommandValueSchema,
  resolutionNote: z.string().max(1000).optional()
});
export type AlertCommandInput = z.infer<typeof alertCommandSchema>;

export const addInvestigationNoteSchema = z.object({
  body: z.string().min(2, 'Note is required').max(1000)
});
export type AddInvestigationNoteInput = z.infer<typeof addInvestigationNoteSchema>;

export const alertListQuerySchema = z.object({
  status: alertStatusSchema.optional(),
  severity: severitySchema.optional(),
  reporterId: z.string().min(1).optional(),
  riskyAction: riskyActionSchema.optional()
});
export type AlertListQuery = z.infer<typeof alertListQuerySchema>;
