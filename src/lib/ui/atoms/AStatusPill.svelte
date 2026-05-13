<script lang="ts">
  import type { AlertStatus, Severity } from '$lib/domains';
  import { severityLabel, statusLabel } from '$lib/domains/labels';

  export let status: AlertStatus | null = null;
  export let severity: Severity | null = null;
</script>

{#if status}
  <span class={`a-status-pill status-${status}`}>{statusLabel[status]}</span>
{:else if severity}
  <span class={`a-status-pill sev-${severity}`}>{severityLabel[severity]}</span>
{/if}

<style lang="scss">
  .a-status-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    border-radius: 999px;
    padding: 0.3125rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .sev-low,
  .status-new {
    background: var(--admin-tint);
    color: var(--admin-primary);
  }
  .sev-medium,
  .status-investigating {
    background: #fff3dd;
    color: var(--risk-med);
  }
  .sev-high,
  .status-resolved_malicious {
    background: #ffe6eb;
    color: var(--risk-high);
  }
  .sev-critical,
  .status-closed {
    background: #ffd5d5;
    color: #7d1d1d;
  }
  .status-resolved_safe {
    background: var(--employee-tint);
    color: var(--employee-primary);
  }
</style>
