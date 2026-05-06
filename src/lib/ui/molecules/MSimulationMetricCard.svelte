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
    background: linear-gradient(145deg, #ffffff, #f4f8fd);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);

    > .label {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    > .value-frame {
      display: block;
      margin-top: 0.2rem;
    }

    > .hint {
      display: block;
      margin-top: 0.35rem;
      color: var(--text-muted);
      line-height: 1.35;
    }
  }
</style>
