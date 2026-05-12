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
              <a href={`/admin/alerts/${report.alertId}`} aria-label={`Open alert for ${report.subject}`}>
                <strong>{report.subject}</strong>
                <span>{report.sender} &middot; {formatDate(report.createdAt)}</span>
                <small>{report.riskyActions.map(formatAction).join(', ')}</small>
              </a>
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
    gap: 0.875rem;

    > .hero {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: end;
      overflow: hidden;
      border-radius: var(--radius-md);
      padding: 0.875rem 1rem 0.875rem 1.25rem;
      background: linear-gradient(180deg, color-mix(in srgb, #27713f 7%, #ffffff), #ffffff 58%);

      &::before {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 5px;
        background: #27713f;
      }

      &.yellow {
        background: linear-gradient(180deg, color-mix(in srgb, #b7791f 8%, #ffffff), #ffffff 58%);

        &::before {
          background: #b7791f;
        }
      }

      &.red {
        background: linear-gradient(180deg, color-mix(in srgb, #b42318 8%, #ffffff), #ffffff 58%);

        &::before {
          background: #b42318;
        }
      }

      h2,
      p {
        margin: 0;
      }

      h2 {
        font-size: 1.625rem;
        line-height: 1.12;
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
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      background: color-mix(in srgb, var(--surface-muted) 72%, #ffffff);

      :global(.m-metric-card) {
        min-height: 6.25rem;
        background: rgba(255, 255, 255, 0.72);
      }
    }

    > .breakdown,
    .history-grid > article {
      background: color-mix(in srgb, var(--surface-muted) 72%, #ffffff);
      border-radius: var(--radius);
      padding: 1rem;
    }

    > .breakdown {
      display: grid;
      gap: 0.875rem;

      h2 {
        margin: 0;
        font-size: 1.375rem;
      }

      > div {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.5rem;
      }

      span {
        border-radius: var(--radius-sm);
        padding: 0.875rem;
        background: rgba(255, 255, 255, 0.72);
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
      gap: 0.875rem;

      h2 {
        margin: 0 0 0.875rem;
        font-size: 1.375rem;
      }

      p {
        color: var(--text-muted);
      }

      ul {
        display: grid;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.72);
        transition:
          background-color 140ms ease,
          box-shadow 140ms ease,
          transform 140ms ease;

        span,
        small {
          color: var(--text-muted);
          line-height: 1.35;
        }

        > a {
          display: grid;
          gap: 0.25rem;
          min-height: 4.375rem;
          padding: 0.75rem;
          border-radius: inherit;
          color: inherit;
          text-decoration: none;

          &:hover {
            background: color-mix(in srgb, var(--admin-primary) 4%, rgba(255, 255, 255, 0.72));
            box-shadow: 0 0.5rem 1.375rem rgba(24, 99, 220, 0.08);
            transform: translateY(-1px);
          }

          &:focus-visible {
            outline: none;
            box-shadow: var(--shadow-focus);
          }
        }

        &:not(:has(a)) {
          display: grid;
          gap: 0.25rem;
          padding: 0.75rem;
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
