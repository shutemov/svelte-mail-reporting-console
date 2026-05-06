import { buildDashboardSummary } from '$lib/domains/dashboard-aggregation';
import type { AlertDetailsView, AlertListQuery, LearningAssignmentView } from '$lib/domains/types';
import type { MockRepository } from './mock-state';
import { buildSimulationSummary } from './simulation-metrics';

const moduleContent = {
  id: 'phishing-basics' as const,
  title: 'Phishing Basics',
  body: 'Always verify sender domain, avoid unknown links, and report suspicious requests.'
};

export class ServerQueries {
  constructor(private repository: MockRepository) {}

  listReportsForUser(userId: string) {
    return this.repository.listReportsForUser(userId);
  }

  getReportById(reportId: string) {
    return this.repository.getReportById(reportId);
  }

  listAlerts(query: AlertListQuery): AlertDetailsView[] {
    return this.repository.listAlerts(query);
  }

  getAlertDetails(alertId: string) {
    return this.repository.getAlertDetails(alertId);
  }

  getDashboardSummary() {
    return buildDashboardSummary(this.repository.getCurrentState());
  }

  getSimulationSummary() {
    return buildSimulationSummary(this.repository.getCurrentState(), new Date().toISOString());
  }

  listLearningForAssignee(userId: string): LearningAssignmentView[] {
    const state = this.repository.getCurrentState();

    return state.learningAssignments
      .filter((assignment) => assignment.assigneeId === userId)
      .map((assignment) => {
        const alert = state.alerts.find((item) => item.id === assignment.alertId);
        if (!alert) {
          return null;
        }

        const report = state.reports.find((item) => item.id === alert.reportId);
        if (!report) {
          return null;
        }

        return {
          assignment,
          alert,
          report: {
            id: report.id,
            subject: report.subject,
            sender: report.sender,
            riskyActions: report.riskyActions
          },
          module: moduleContent
        };
      })
      .filter((value): value is LearningAssignmentView => value !== null);
  }

  getLearningAssignmentView(assignmentId: string) {
    const state = this.repository.getCurrentState();
    const assignment = state.learningAssignments.find((item) => item.id === assignmentId);
    if (!assignment) {
      return null;
    }

    const alert = state.alerts.find((item) => item.id === assignment.alertId);
    if (!alert) {
      return null;
    }

    const report = state.reports.find((item) => item.id === alert.reportId);
    if (!report) {
      return null;
    }

    return {
      assignment,
      alert,
      report: {
        id: report.id,
        subject: report.subject,
        sender: report.sender,
        riskyActions: report.riskyActions
      },
      module: moduleContent
    };
  }
}
