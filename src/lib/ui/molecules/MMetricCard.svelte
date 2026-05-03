<script lang="ts">
  export let label = '';
  export let value: string | number = '';
</script>

<article class="m-metric-card">
  <p class="label">{label}</p>
  <strong class="value">{value}</strong>
</article>

<style lang="scss">
  .m-metric-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);

    > .label {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    > .value {
      font-size: 1.8rem;
    }
  }
</style>
