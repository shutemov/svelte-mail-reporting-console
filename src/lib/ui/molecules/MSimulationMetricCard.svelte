<script lang="ts">
  import MAnimatedMetricValue from '$lib/ui/molecules/MAnimatedMetricValue.svelte';

  export let label = '';
  export let value: string | number = '';
  export let hint = '';
</script>

<article class="m-simulation-metric-card">
  <p class="label">{label}</p>
  <div class="value-frame">
    <MAnimatedMetricValue {value} ariaLabel={`${label}: ${value}`} />
  </div>
  {#if hint}
    <small class="hint">{hint}</small>
  {/if}
</article>

<style lang="scss">
  .m-simulation-metric-card {
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--admin-primary) 8%, #ffffff), #ffffff 48%);
    border: 0;
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    min-height: 7rem;

    > .label {
      margin: 0;
      color: var(--text-muted);
      font: 400 0.75rem/1.4 var(--font-mono);
      text-transform: uppercase;
    }

    > .value-frame {
      display: block;
      margin-top: 0.2rem;
    }

    > .hint {
      display: block;
      margin-top: 0.35rem;
      color: var(--text-muted);
      font-size: 0.8125rem;
      line-height: 1.35;
    }
  }
</style>
