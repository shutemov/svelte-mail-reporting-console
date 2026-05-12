<script lang="ts">
  import type { EmployeeProfileSummary } from '$lib/domains/types';

  export let summary: EmployeeProfileSummary;

  $: href = summary.user.profileEnabled ? `/admin/employees/${summary.user.id}` : '';
  $: cardLabel = `${summary.user.name}: ${summary.riskStatusLabel}`;
</script>

{#if href}
  <a class="m-employee-risk-card {summary.riskStatus}" {href} aria-label={cardLabel}>
    <div class="heading">
      <div>
        <h3>{summary.user.name}</h3>
        <p>{summary.user.persona?.replaceAll('_', ' ') ?? 'employee'}</p>
      </div>
      <span class="status">{summary.riskStatusLabel}</span>
    </div>

    <div class="metrics">
      <span><strong>{summary.totalReports}</strong> reports</span>
      <span><strong>{summary.highRiskReports}</strong> risky</span>
      <span><strong>{summary.openAlerts}</strong> open</span>
      <span><strong>{summary.learningCompletionRate}%</strong> learning</span>
    </div>

    <p class="reason">
      Clicks {summary.clickedLinkCount} &middot; Attachments {summary.downloadedAttachmentCount} &middot; Credentials
      {summary.enteredCredentialsCount}
    </p>
  </a>
{:else}
  <article class="m-employee-risk-card {summary.riskStatus} summary-only" aria-label={cardLabel}>
    <div class="heading">
      <div>
        <h3>{summary.user.name}</h3>
        <p>{summary.user.persona?.replaceAll('_', ' ') ?? 'employee'}</p>
      </div>
      <span class="status">{summary.riskStatusLabel}</span>
    </div>

    <div class="metrics">
      <span><strong>{summary.totalReports}</strong> reports</span>
      <span><strong>{summary.highRiskReports}</strong> risky</span>
      <span><strong>{summary.openAlerts}</strong> open</span>
      <span><strong>{summary.learningCompletionRate}%</strong> learning</span>
    </div>

    <p class="reason">
      Summary only &middot; Clicks {summary.clickedLinkCount} &middot; Attachments {summary.downloadedAttachmentCount}
    </p>
  </article>
{/if}

<style lang="scss">
  .m-employee-risk-card {
    display: grid;
    gap: 0.75rem;
    min-height: 12.5rem;
    text-decoration: none;
    color: inherit;
    background: var(--surface-raised);
    border: 0;
    border-left: 0.35rem solid var(--employee-primary);
    border-radius: var(--radius-md);
    padding: 0.875rem;
    box-shadow: var(--shadow);

    &.yellow {
      border-left-color: #b7791f;
    }

    &.red {
      border-left-color: #b42318;
    }

    &:not(.summary-only):hover {
      transform: translateY(-1px);
      background: var(--employee-tint);
    }

    &.summary-only {
      background: var(--surface-muted);
    }

    > .heading {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      align-items: start;

      h3,
      p {
        margin: 0;
      }

      h3 {
        font-size: 1rem;
      }

      p {
        margin-top: 0.2rem;
        color: var(--text-muted);
        font-size: 0.8125rem;
        text-transform: capitalize;
      }
    }

    .status {
      flex: none;
      border-radius: 999px;
      padding: 0.25rem 0.55rem;
      background: #edf8f0;
      color: #27713f;
      font-weight: 500;
      font-size: 0.75rem;
    }

    &.yellow .status {
      background: #fff7e6;
      color: #92560f;
    }

    &.red .status {
      background: #fff0ed;
      color: #b42318;
    }

    > .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-2);

      span {
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.55rem;
        background: white;
        color: var(--text-muted);
        font-size: 0.8125rem;
      }

      strong {
        display: block;
        color: var(--text);
        font-size: 1.1rem;
      }
    }

    > .reason {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.35;
      font-size: 0.8125rem;
    }
  }
</style>
