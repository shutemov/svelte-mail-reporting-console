import { describe, expect, it } from 'vitest';
import { InMemoryMockRepository } from '$lib/server/mock-repository';
import { InMemoryTestControls } from '$lib/server/test-controls';
import { DefaultServerCommands } from '$lib/server/commands';

const now = () => '2026-01-11T12:00:00.000Z';

describe('server commands', () => {
  it('submits report for employee', async () => {
    const repository = new InMemoryMockRepository('empty');
    const controls = new InMemoryTestControls(repository);
    const commands = new DefaultServerCommands(repository, controls, now);

    const actor = repository.getUserById('employee-1');
    if (!actor) throw new Error('missing actor');

    const result = await commands.submitReport(actor, {
      sender: 'bad@mailer.com',
      subject: 'Urgent',
      receivedAt: now(),
      reason: 'Asks to send credentials',
      riskyActions: ['entered_credentials'],
      messagePreview: 'send password'
    });

    expect(result.success).toBe(true);
    expect(result.data?.alertId).toBeTruthy();
  });

  it('blocks employee from admin commands', async () => {
    const repository = new InMemoryMockRepository('default');
    const controls = new InMemoryTestControls(repository);
    const commands = new DefaultServerCommands(repository, controls, now);
    const actor = repository.getUserById('employee-1');
    if (!actor) throw new Error('missing actor');

    const result = await commands.applyAlertCommand(actor, 'alert-1', {
      command: 'resolveAsSafe'
    });

    expect(result.success).toBe(false);
    expect(result.formError).toMatch(/Permission|Unsupported/);
  });

  it('consumes fail-next once', async () => {
    const repository = new InMemoryMockRepository('empty');
    const controls = new InMemoryTestControls(repository);
    const commands = new DefaultServerCommands(repository, controls, now);
    const actor = repository.getUserById('employee-1');
    if (!actor) throw new Error('missing actor');

    controls.failNext({ command: 'submitReport', status: 500, message: 'Forced fail' });

    const first = await commands.submitReport(actor, {
      sender: 'x@y.com',
      subject: 'a',
      receivedAt: now(),
      reason: 'valid reason',
      riskyActions: ['opened_email']
    });
    expect(first.success).toBe(false);

    const second = await commands.submitReport(actor, {
      sender: 'x@y.com',
      subject: 'subject ok',
      receivedAt: now(),
      reason: 'valid reason',
      riskyActions: ['opened_email']
    });
    expect(second.success).toBe(true);
  });

  it('injects synthetic simulation report for admin', async () => {
    const repository = new InMemoryMockRepository('empty');
    const controls = new InMemoryTestControls(repository);
    const commands = new DefaultServerCommands(repository, controls, now);
    const actor = repository.getUserById('admin-1');
    if (!actor) throw new Error('missing actor');

    const result = await commands.injectSimulationReport(actor);
    const state = repository.getCurrentState();

    expect(result.success).toBe(true);
    expect(state.alerts).toHaveLength(1);
    expect(state.generatedCaseMeta).toHaveLength(1);
    expect(result.data?.queueHealth.openAlerts).toBe(1);
  });
});
