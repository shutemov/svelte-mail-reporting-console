import { z } from 'zod';
import { alertSchema, severitySchema } from '../alert/models';
import { demoUserSchema } from '../identity/models';
import { learningAssignmentSchema } from '../learning/models';
import { reportSchema, riskyActionSchema } from '../report/models';

export const employeeRiskStatusSchema = z.enum(['green', 'yellow', 'red']);
export type EmployeeRiskStatus = z.infer<typeof employeeRiskStatusSchema>;

export const employeeProfileSummarySchema = z.object({
  user: demoUserSchema,
  riskStatus: employeeRiskStatusSchema,
  riskStatusLabel: z.string(),
  totalReports: z.number(),
  reportsLast15m: z.number(),
  openAlerts: z.number(),
  highRiskReports: z.number(),
  clickedLinkCount: z.number(),
  downloadedAttachmentCount: z.number(),
  enteredCredentialsCount: z.number(),
  confirmedMalicious: z.number(),
  resolvedSafe: z.number(),
  pendingTriage: z.number(),
  learningAssigned: z.number(),
  learningCompleted: z.number(),
  learningCompletionRate: z.number(),
  lastReportAt: z.string().nullable()
});
export type EmployeeProfileSummary = z.infer<typeof employeeProfileSummarySchema>;

export const employeeRiskSignalTypeSchema = z.union([
  riskyActionSchema,
  z.enum(['confirmed_malicious', 'resolved_safe', 'learning_assigned', 'learning_completed'])
]);

export const employeeRiskSignalSchema = z.object({
  id: z.string(),
  alertId: z.string(),
  reportId: z.string(),
  type: employeeRiskSignalTypeSchema,
  severity: severitySchema,
  createdAt: z.string(),
  message: z.string()
});
export type EmployeeRiskSignal = z.infer<typeof employeeRiskSignalSchema>;

export const employeeProfileDetailsSchema = z.object({
  user: demoUserSchema,
  summary: employeeProfileSummarySchema,
  reports: z.array(reportSchema),
  alerts: z.array(alertSchema),
  learningAssignments: z.array(learningAssignmentSchema),
  recentRiskSignals: z.array(employeeRiskSignalSchema)
});
export type EmployeeProfileDetails = z.infer<typeof employeeProfileDetailsSchema>;
