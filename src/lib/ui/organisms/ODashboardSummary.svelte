<script lang="ts">
  import type { DashboardSummary } from '$lib/domains/types';

  export let summary: DashboardSummary;
</script>

<section class="o-dashboard-summary">
  <article class="metric-group load">
    <div class="metric-group-head">
      <h2>Load</h2>
      <span>Queue pressure</span>
    </div>
    <div class="metric-pair">
      <div class="metric-mini">
        <span class="label">Open alerts</span>
        <strong class="value">{summary.openAlerts}</strong>
        <span class="note">{summary.incomingReportsLast15m} incoming in 15m</span>
      </div>
      <div class="metric-mini">
        <span class="label">Backlog</span>
        <strong class="value">{summary.backlogGrowthRate}</strong>
        <span class="note">growth / min</span>
      </div>
    </div>
  </article>

  <article class="metric-group quality">
    <div class="metric-group-head">
      <h2>Quality</h2>
      <span>Decision risk</span>
    </div>
    <div class="metric-pair">
      <div class="metric-mini">
        <span class="label">Malicious</span>
        <strong class="value">{summary.confirmedMalicious}</strong>
        <span class="note">confirmed cases</span>
      </div>
      <div class="metric-mini">
        <span class="label">Avg triage</span>
        <strong class="value">{summary.averageTriageMinutes === null ? '-' : summary.averageTriageMinutes}</strong>
        <span class="note">minutes</span>
      </div>
    </div>
  </article>

  <article class="metric-group remediation">
    <div class="metric-group-head">
      <h2>Remediation</h2>
      <span>Learning loop</span>
    </div>
    <div class="metric-pair">
      <div class="metric-mini">
        <span class="label">Risky reports</span>
        <strong class="value">{summary.highRiskReports}</strong>
        <span class="note">{summary.riskyActionReports} risky actions</span>
      </div>
      <div class="metric-mini">
        <span class="label">Learning</span>
        <strong class="value">{summary.learningCompletionRate}%</strong>
        <span class="note">completion</span>
      </div>
    </div>
  </article>
</section>

<style lang="scss">
  .o-dashboard-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;

    > .metric-group {
      --group-accent: var(--admin-primary);
      --metric-divider: rgba(24, 99, 220, 0.16);
      position: relative;
      display: grid;
      gap: 0.75rem;
      min-height: 8.875rem;
      overflow: hidden;
      padding: 0.875rem;
      border-radius: var(--radius);
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--group-accent) 9%, #ffffff), #ffffff 48%);

      &::before {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 5px;
        background: var(--group-accent);
      }

      &.quality {
        --group-accent: #7c3aed;
        --metric-divider: rgba(124, 58, 237, 0.16);
      }

      &.remediation {
        --group-accent: var(--employee-primary);
        --metric-divider: rgba(10, 126, 91, 0.16);
      }
    }

    .metric-group-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-inline-start: 0.5rem;

      h2 {
        color: var(--group-accent);
        font-size: 1.125rem;
        line-height: 1.2;
      }

      span {
        color: var(--text-muted);
        font: 400 0.6875rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }
    }

    .metric-pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 5.375rem;
      overflow: hidden;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.72);
    }

    .metric-mini {
      display: grid;
      align-content: start;
      gap: 0.375rem;
      min-width: 0;
      padding: 0.75rem 0.875rem;

      + .metric-mini {
        box-shadow: inset 1px 0 0 var(--metric-divider);
      }
    }

    .label {
      color: var(--text-muted);
      font: 400 0.6875rem/1.4 var(--font-mono);
      text-transform: uppercase;
    }

    .value {
      color: var(--text);
      font-family: var(--font-display);
      font-size: 1.875rem;
      font-weight: 400;
      line-height: 1;
    }

    .note {
      color: var(--text-muted);
      font-size: 0.75rem;
      line-height: 1.35;
    }

    @media (max-width: 1180px) {
      grid-template-columns: 1fr;
    }

    @media (max-width: 760px) {
      .metric-pair {
        grid-template-columns: 1fr;
      }

      .metric-mini + .metric-mini {
        box-shadow: inset 0 1px 0 var(--metric-divider);
      }
    }
  }
</style>
