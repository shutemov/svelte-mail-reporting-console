<script lang="ts">
  import type { Severity } from '$lib/domains/types';

  type SeverityMixInput = Partial<Record<Severity, number | string | null | undefined>>;

  export let mix: SeverityMixInput = {};

  const severityItems: Array<{ key: Severity; label: string }> = [
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
    { key: 'critical', label: 'Critical' }
  ];

  function toNumber(value: number | string | null | undefined) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  $: segments = severityItems.map((item) => ({
    ...item,
    value: toNumber(mix[item.key])
  }));
  $: total = segments.reduce((sum, item) => sum + item.value, 0);
  $: barTotal = total > 0 ? total : 1;
  $: isBalanced = total === 100;
</script>

<div class="m-severity-mix-bar" aria-label={`Severity mix total ${total}%`}>
  <div
    class="mix-bar"
    role="img"
    aria-label={segments.map((item) => `${item.label} ${item.value}%`).join(', ')}
  >
    {#each segments as segment (segment.key)}
      {#if segment.value > 0}
        <span
          class={`segment ${segment.key}`}
          style:width={`${(segment.value / barTotal) * 100}%`}
          title={`${segment.label}: ${segment.value}%`}
        ></span>
      {/if}
    {/each}
  </div>

  <div class="mix-legend">
    {#each segments as segment (segment.key)}
      <span class={`legend-item ${segment.key}`}>
        <i aria-hidden="true"></i>
        <b>{segment.label}</b>
        <em>{segment.value}%</em>
      </span>
    {/each}
    <span class="total" class:balanced={isBalanced}>Total {total}%</span>
  </div>
</div>

<style lang="scss">
  .m-severity-mix-bar {
    display: grid;
    gap: 0.5rem;
    padding: 0.625rem;
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.62);
  }

  .mix-bar {
    display: flex;
    min-height: 0.875rem;
    overflow: hidden;
    border-radius: 999px;
    background: var(--surface-muted);
  }

  .segment {
    min-width: 0.25rem;
    transition: width 160ms ease;

    &.low {
      background: color-mix(in srgb, var(--employee-primary) 50%, #ffffff);
    }

    &.medium {
      background: color-mix(in srgb, var(--risk-med) 48%, #ffffff);
    }

    &.high {
      background: color-mix(in srgb, var(--risk-high) 46%, #ffffff);
    }

    &.critical {
      background: color-mix(in srgb, var(--risk-high) 72%, #ffffff);
    }
  }

  .mix-legend {
    display: flex;
    align-items: center;
    gap: 0.5rem 0.75rem;
    flex-wrap: wrap;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3125rem;
    color: var(--text-muted);
    font-size: 0.75rem;
    line-height: 1.2;

    i {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 999px;
    }

    b {
      color: var(--text-soft);
      font-weight: 500;
    }

    em {
      font-style: normal;
    }

    &.low i {
      background: color-mix(in srgb, var(--employee-primary) 50%, #ffffff);
    }

    &.medium i {
      background: color-mix(in srgb, var(--risk-med) 48%, #ffffff);
    }

    &.high i {
      background: color-mix(in srgb, var(--risk-high) 46%, #ffffff);
    }

    &.critical i {
      background: color-mix(in srgb, var(--risk-high) 72%, #ffffff);
    }
  }

  .total {
    margin-inline-start: auto;
    color: var(--warning);
    font-size: 0.75rem;
    font-weight: 500;

    &.balanced {
      color: var(--text-muted);
    }
  }
</style>
