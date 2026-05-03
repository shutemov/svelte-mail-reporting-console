<script lang="ts">
  import type { AlertStatus, Severity } from '$lib/domains/types';
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
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.78rem;
    font-weight: 700;
  }
  .sev-low,
  .status-new {
    background: #e6f0ff;
    color: #104b8e;
  }
  .sev-medium,
  .status-investigating {
    background: #fff3dd;
    color: #8b5800;
  }
  .sev-high,
  .status-resolved_malicious {
    background: #ffe6eb;
    color: #9a1f38;
  }
  .sev-critical,
  .status-closed {
    background: #ffd5d5;
    color: #7d1d1d;
  }
  .status-resolved_safe {
    background: #ddf8e8;
    color: #136536;
  }
</style>
