import { z } from 'zod';

export const dashboardSummarySchema = z.object({
  openAlerts: z.number(),
  incomingReportsLast15m: z.number(),
  confirmedMalicious: z.number(),
  highRiskReports: z.number(),
  riskyActionReports: z.number(),
  backlogGrowthRate: z.number(),
  averageTriageMinutes: z.number().nullable(),
  learningCompletionRate: z.number()
});
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
