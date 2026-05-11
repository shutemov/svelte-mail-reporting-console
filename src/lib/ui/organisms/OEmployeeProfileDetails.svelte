<script lang="ts">
  import type { EmployeeProfileDetails } from '$lib/domains/types';
  import MMetricCard from '$lib/ui/molecules/MMetricCard.svelte';

  export let details: EmployeeProfileDetails;

  $: summary = details.summary;

  function formatDate(value: string | null | undefined): string {
    return value ? new Date(value).toLocaleString() : 'n/a';
  }

  function formatAction(value: string): string {
    return value.replaceAll('_', ' ');
  }
</script>

<section class="o-employee-profile-details">
  <section class="hero {summary.riskStatus}">
    <div>
      <p class="eyebrow">{details.user.persona?.replaceAll('_', ' ') ?? 'employee'}</p>
      <h2>{details.user.name}</h2>
      <p>{summary.riskStatusLabel}</p>
    </div>
    <div class="last-report">
      <span>Last report</span>
      <strong>{formatDate(summary.lastReportAt)}</strong>
    </div>
  </section>

  <section class="metrics" aria-label="Employee profile metrics">
    <MMetricCard label="Reports" value={summary.totalReports} />
    <MMetricCard label="Reports last 15m" value={summary.reportsLast15m} />
    <MMetricCard label="Open alerts" value={summary.openAlerts} />
    <MMetricCard label="High-risk reports" value={summary.highRiskReports} />
    <MMetricCard label="Confirmed malicious" value={summary.confirmedMalicious} />
    <MMetricCard label="Learning completion (%)" value={summary.learningCompletionRate} />
  </section>

  <section class="breakdown">
    <h2>Risk action breakdown</h2>
    <div>
      <span><strong>{summary.clickedLinkCount}</strong> clicked links</span>
      <span><strong>{summary.downloadedAttachmentCount}</strong> downloaded attachments</span>
      <span><strong>{summary.enteredCredentialsCount}</strong> entered credentials</span>
    </div>
  </section>

  <section class="history-grid">
    <article>
      <h2>Recent risk signals</h2>
      {#if details.recentRiskSignals.length === 0}
        <p>No risk signals yet.</p>
      {:else}
        <ul>
          {#each details.recentRiskSignals as signal (signal.id)}
            <li>
              <strong>{signal.message}</strong>
              <span>{signal.severity} &middot; {formatDate(signal.createdAt)}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </article>

    <article>
      <h2>Reports</h2>
      {#if details.reports.length === 0}
        <p>No reports yet.</p>
      {:else}
        <ul>
          {#each details.reports as report (report.id)}
            <li>
              <strong>{report.subject}</strong>
              <span>{report.sender} &middot; {formatDate(report.createdAt)}</span>
              <small>{report.riskyActions.map(formatAction).join(', ')}</small>
            </li>
          {/each}
        </ul>
      {/if}
    </article>

    <article>
      <h2>Alerts</h2>
      {#if details.alerts.length === 0}
        <p>No alerts yet.</p>
      {:else}
        <ul>
          {#each details.alerts as alert (alert.id)}
            <li>
              <strong>{alert.severity} / {alert.status}</strong>
              <span>{alert.finalOutcome ?? 'pending'} &middot; {formatDate(alert.createdAt)}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </article>

    <article>
      <h2>Learning</h2>
      {#if details.learningAssignments.length === 0}
        <p>No learning assignments yet.</p>
      {:else}
        <ul>
          {#each details.learningAssignments as assignment (assignment.id)}
            <li>
              <strong>{assignment.moduleId}</strong>
              <span>{assignment.status} &middot; assigned {formatDate(assignment.assignedAt)}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </article>
  </section>
</section>

<style lang="scss">
  .o-employee-profile-details {
    display: grid;
    gap: var(--space-4);

    > .hero {
      display: flex;
      justify-content: space-between;
      gap: var(--space-4);
      align-items: end;
      background: var(--surface);
      border: 1px solid var(--border);
      border-left: 0.5rem solid #27713f;
      border-radius: var(--radius);
      padding: var(--space-4);
      box-shadow: var(--shadow);

      &.yellow {
        border-left-color: #b7791f;
      }

      &.red {
        border-left-color: #b42318;
      }

      h2,
      p {
        margin: 0;
      }

      h2 {
        font-size: 1.8rem;
      }

      .eyebrow {
        color: var(--text-muted);
        text-transform: capitalize;
      }

      .last-report {
        display: grid;
        gap: 0.25rem;
        text-align: right;

        span {
          color: var(--text-muted);
        }
      }
    }

    > .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-3);
    }

    > .breakdown,
    .history-grid > article {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: var(--space-4);
      box-shadow: var(--shadow);
    }

    > .breakdown {
      display: grid;
      gap: var(--space-3);

      h2 {
        margin: 0;
      }

      > div {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--space-3);
      }

      span {
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
        background: var(--surface-muted);
        color: var(--text-muted);
      }

      strong {
        display: block;
        color: var(--text);
        font-size: 1.4rem;
      }
    }

    > .history-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-3);

      h2 {
        margin: 0 0 var(--space-3);
      }

      p {
        color: var(--text-muted);
      }

      ul {
        display: grid;
        gap: var(--space-2);
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        display: grid;
        gap: 0.2rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: var(--space-2);

        span,
        small {
          color: var(--text-muted);
          line-height: 1.35;
        }
      }
    }

    @media (max-width: 850px) {
      > .hero {
        display: grid;
        align-items: start;

        .last-report {
          text-align: left;
        }
      }

      > .history-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
