import type { ZodError } from 'zod';
import {
  addInvestigationNoteSchema,
  alertCommandSchema,
  assignLearningSchema,
  completeLearningSchema,
  simulationConfigSchema,
  submitReportSchema
} from '$lib/domains';
import {
  type AddInvestigationNoteInput,
  type AlertCommandInput,
  type AssignLearningInput,
  type CompleteLearningInput,
  type DemoUser,
  type LearningAssignment,
  type LearningAssignmentView,
  type MutationResult,
  type SimulationConfig,
  type SimulationSummary,
  type SubmitReportInput
} from '$lib/domains';
import { applyAlertCommand, type AlertCommand } from '$lib/domains/alert';
import type { MockRepository } from './mock-state';
import type { InMemoryTestControls } from './test-controls';
import { createTimelineEvent } from './timeline-factory';
import { ServerQueries } from './queries';
import { generateSyntheticReport, pickSimulationReporter } from './simulation-engine';
import { buildSimulationSummary } from './simulation-metrics';

type Clock = () => string;
const maxSimulationCatchUpPerTick = 25;

export interface ServerCommands {
  submitReport(
    actor: DemoUser,
    input: SubmitReportInput
  ): Promise<MutationResult<SubmitReportInput, { reportId: string; alertId: string }>>;
  applyAlertCommand(
    actor: DemoUser,
    alertId: string,
    input: AlertCommandInput
  ): Promise<MutationResult<AlertCommandInput, import('$lib/domains').AlertDetailsView>>;
  addInvestigationNote(
    actor: DemoUser,
    alertId: string,
    input: AddInvestigationNoteInput
  ): Promise<MutationResult<AddInvestigationNoteInput, import('$lib/domains').AlertDetailsView>>;
  assignLearning(
    actor: DemoUser,
    alertId: string,
    input: AssignLearningInput
  ): Promise<MutationResult<AssignLearningInput, LearningAssignment>>;
  updateSimulationConfig(
    actor: DemoUser,
    input: SimulationConfig
  ): Promise<MutationResult<SimulationConfig, SimulationSummary>>;
  startSimulation(actor: DemoUser): Promise<MutationResult<Record<string, never>, SimulationSummary>>;
  pauseSimulation(actor: DemoUser): Promise<MutationResult<Record<string, never>, SimulationSummary>>;
  injectSimulationReport(
    actor: DemoUser
  ): Promise<MutationResult<Record<string, never>, SimulationSummary>>;
  resetSimulation(actor: DemoUser): Promise<MutationResult<Record<string, never>, SimulationSummary>>;
  tickSimulation(actor: DemoUser): Promise<MutationResult<Record<string, never>, SimulationSummary>>;
  startLearning(actor: DemoUser, assignmentId: string): Promise<LearningAssignmentView>;
  completeLearning(
    actor: DemoUser,
    input: CompleteLearningInput
  ): Promise<MutationResult<CompleteLearningInput, LearningAssignmentView>>;
}

function toFieldErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path.length === 0 ? 'form' : issue.path.join('.');
    if (!acc[key]) {
      acc[key] = issue.message;
    }
    return acc;
  }, {});
}

export class DefaultServerCommands implements ServerCommands {
  private queries: ServerQueries;

  constructor(
    private repository: MockRepository,
    private testControls: InMemoryTestControls,
    private now: Clock = () => new Date().toISOString()
  ) {
    this.queries = new ServerQueries(repository);
  }

  async submitReport(actor: DemoUser, input: SubmitReportInput) {
    const fail = this.testControls.consumeFailure('submitReport');
    if (fail) {
      return {
        success: false,
        values: input,
        formError: fail.message
      };
    }

    if (actor.role !== 'employee') {
      return {
        success: false,
        values: input,
        formError: 'Only employee can submit reports'
      };
    }

    const parsed = submitReportSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    const created = this.repository.createReport(parsed.data, actor, this.now());
    this.repository.addTimelineEvent(
      createTimelineEvent({
        alertId: created.alertId,
        actor,
        type: 'report_submitted',
        message: 'Suspicious report submitted',
        now: created.createdAt
      })
    );

    return {
      success: true,
      data: {
        reportId: created.id,
        alertId: created.alertId
      }
    };
  }

  async applyAlertCommand(actor: DemoUser, alertId: string, input: AlertCommandInput) {
    const fail = this.testControls.consumeFailure('updateAlertStatus');
    if (fail) {
      return {
        success: false,
        values: input,
        formError: fail.message
      };
    }

    const parsed = alertCommandSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    const details = this.repository.getAlertDetails(alertId);
    if (!details) {
      return {
        success: false,
        values: input,
        formError: 'Alert not found'
      };
    }

    try {
      const updated = applyAlertCommand(
        details.alert,
        actor,
        parsed.data.command as AlertCommand,
        this.now()
      );

      this.repository.updateAlert(updated);

      const map = {
        startInvestigation: {
          type: 'investigation_started' as const,
          message: 'Investigation started'
        },
        resolveAsSafe: {
          type: 'alert_resolved_safe' as const,
          message: parsed.data.resolutionNote || 'Alert resolved as safe'
        },
        resolveAsMalicious: {
          type: 'alert_resolved_malicious' as const,
          message: parsed.data.resolutionNote || 'Alert resolved as malicious'
        },
        closeAlert: {
          type: 'alert_closed' as const,
          message: parsed.data.resolutionNote || 'Alert closed'
        }
      };

      const entry = map[parsed.data.command];
      this.repository.addTimelineEvent(
        createTimelineEvent({
          alertId,
          actor,
          type: entry.type,
          message: entry.message,
          now: updated.updatedAt
        })
      );

      const next = this.repository.getAlertDetails(alertId);
      if (!next) {
        return { success: false, formError: 'Alert not found after update' };
      }

      return {
        success: true,
        data: next
      };
    } catch {
      return {
        success: false,
        values: input,
        formError: actor.role !== 'admin' ? 'Permission denied' : 'Unsupported transition'
      };
    }
  }

  async addInvestigationNote(actor: DemoUser, alertId: string, input: AddInvestigationNoteInput) {
    const parsed = addInvestigationNoteSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    if (actor.role !== 'admin') {
      return {
        success: false,
        values: input,
        formError: 'Permission denied'
      };
    }

    const details = this.repository.getAlertDetails(alertId);
    if (!details) {
      return {
        success: false,
        formError: 'Alert not found'
      };
    }

    this.repository.addTimelineEvent(
      createTimelineEvent({
        alertId,
        actor,
        type: 'note_added',
        message: parsed.data.body,
        now: this.now()
      })
    );

    const next = this.repository.getAlertDetails(alertId);
    if (!next) {
      return {
        success: false,
        formError: 'Alert not found after note'
      };
    }

    return {
      success: true,
      data: next
    };
  }

  async assignLearning(actor: DemoUser, alertId: string, input: AssignLearningInput) {
    const fail = this.testControls.consumeFailure('assignLearning');
    if (fail) {
      return {
        success: false,
        values: input,
        formError: fail.message
      };
    }

    const parsed = assignLearningSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    if (actor.role !== 'admin') {
      return {
        success: false,
        values: input,
        formError: 'Permission denied'
      };
    }

    const details = this.repository.getAlertDetails(alertId);
    if (!details) {
      return {
        success: false,
        values: input,
        formError: 'Alert not found'
      };
    }

    if (details.alert.status !== 'resolved_malicious') {
      return {
        success: false,
        values: input,
        formError: 'Learning is allowed only for resolved malicious alerts'
      };
    }

    if (!['high', 'critical'].includes(details.alert.severity)) {
      return {
        success: false,
        values: input,
        formError: 'Learning requires high or critical severity'
      };
    }

    if (details.learningAssignment) {
      return {
        success: false,
        values: input,
        formError: 'Learning is already assigned'
      };
    }

    const assignment = this.repository.createLearningAssignment({
      alertId,
      assigneeId: details.alert.reporterId,
      moduleId: parsed.data.moduleId,
      now: this.now()
    });

    this.repository.addTimelineEvent(
      createTimelineEvent({
        alertId,
        actor,
        type: 'learning_assigned',
        message: 'Learning module phishing-basics assigned',
        now: assignment.assignedAt
      })
    );

    return {
      success: true,
      data: assignment
    };
  }

  async updateSimulationConfig(actor: DemoUser, input: SimulationConfig) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        values: input,
        formError: 'Permission denied'
      };
    }

    const parsed = simulationConfigSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    this.repository.updateSimulationConfig(parsed.data);

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async startSimulation(actor: DemoUser) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        formError: 'Permission denied'
      };
    }

    this.repository.setSimulationMode('running', this.now());
    this.injectSimulationCase();

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async pauseSimulation(actor: DemoUser) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        formError: 'Permission denied'
      };
    }

    this.repository.setSimulationMode('paused', this.now());

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async injectSimulationReport(actor: DemoUser) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        formError: 'Permission denied'
      };
    }

    this.injectSimulationCase();

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async resetSimulation(actor: DemoUser) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        formError: 'Permission denied'
      };
    }

    this.repository.resetSimulation(this.now());
    const state = this.repository.getCurrentState();
    if (state.simulation.mode === 'running') {
      this.injectSimulationCase();
    }

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async tickSimulation(actor: DemoUser) {
    if (actor.role !== 'admin') {
      return {
        success: false,
        formError: 'Permission denied'
      };
    }

    this.catchUpSimulation();

    return {
      success: true,
      data: this.getSimulationSummary()
    };
  }

  async startLearning(actor: DemoUser, assignmentId: string) {
    const state = this.repository.getCurrentState();
    const assignment = state.learningAssignments.find((item) => item.id === assignmentId);

    if (!assignment) {
      throw new Error('LEARNING_ASSIGNMENT_NOT_FOUND');
    }

    if (actor.role !== 'employee' || assignment.assigneeId !== actor.id) {
      throw new Error('LEARNING_PERMISSION_DENIED');
    }

    if (assignment.status === 'assigned') {
      assignment.status = 'in_progress';
      assignment.startedAt = this.now();
      this.repository.updateLearningAssignment(assignment);
    }

    const view = this.queries.getLearningAssignmentView(assignmentId);
    if (!view) {
      throw new Error('LEARNING_VIEW_NOT_FOUND');
    }

    return view;
  }

  private catchUpSimulation() {
    const state = this.repository.getCurrentState();
    if (state.simulation.mode !== 'running') {
      return;
    }

    const lastGeneratedAt = state.simulation.lastGeneratedAt ?? state.simulation.startedAt;
    if (!lastGeneratedAt) {
      this.injectSimulationCase();
      return;
    }

    const ratePerMinute = state.simulation.config.ratePerMinute;
    const intervalMs = 60_000 / ratePerMinute;
    const elapsedMs = Date.parse(this.now()) - Date.parse(lastGeneratedAt);
    const dueCount = Math.min(
      Math.floor(elapsedMs / intervalMs),
      maxSimulationCatchUpPerTick
    );

    for (let index = 1; index <= dueCount; index += 1) {
      const generatedAt = new Date(Date.parse(lastGeneratedAt) + intervalMs * index).toISOString();
      this.injectSimulationCase(generatedAt);
    }
  }

  private injectSimulationCase(generatedAt = this.now()) {
    const state = this.repository.getCurrentState();
    const reporter = pickSimulationReporter(
      state.users,
      state.simulation.config,
      state.simulation.generatedCount
    );

    if (!reporter) {
      throw new Error('SIMULATION_REPORTER_NOT_FOUND');
    }

    const generated = generateSyntheticReport(
      state.simulation.config,
      generatedAt,
      state.simulation.generatedCount,
      reporter.persona
    );
    const created = this.repository.createSimulationReport(
      generated.input,
      reporter,
      generatedAt,
      generated.meta.groundTruth.severity,
      generated.meta
    );

    this.repository.addTimelineEvent(
      createTimelineEvent({
        alertId: created.alertId,
        actor: reporter,
        type: 'report_submitted',
        message: `Synthetic simulation report generated (${generated.meta.templateId})`,
        now: created.createdAt
      })
    );
  }

  private getSimulationSummary() {
    return buildSimulationSummary(this.repository.getCurrentState(), this.now());
  }

  async completeLearning(actor: DemoUser, input: CompleteLearningInput) {
    const fail = this.testControls.consumeFailure('completeLearning');
    if (fail) {
      return {
        success: false,
        values: input,
        formError: fail.message
      };
    }

    const parsed = completeLearningSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        values: input,
        fieldErrors: toFieldErrors(parsed.error)
      };
    }

    const state = this.repository.getCurrentState();
    const assignment = state.learningAssignments.find(
      (item) => item.id === parsed.data.assignmentId
    );

    if (!assignment) {
      return {
        success: false,
        values: input,
        formError: 'Learning assignment not found'
      };
    }

    if (actor.role !== 'employee' || assignment.assigneeId !== actor.id) {
      return {
        success: false,
        values: input,
        formError: 'Permission denied'
      };
    }

    if (assignment.status !== 'in_progress') {
      return {
        success: false,
        values: input,
        formError: 'Assignment must be in progress'
      };
    }

    assignment.status = 'completed';
    assignment.completedAt = this.now();
    this.repository.updateLearningAssignment(assignment);

    const view = this.queries.getLearningAssignmentView(assignment.id);
    if (!view) {
      return {
        success: false,
        values: input,
        formError: 'Learning view not found'
      };
    }

    return {
      success: true,
      data: view
    };
  }
}
