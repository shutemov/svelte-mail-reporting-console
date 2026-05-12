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
    border: 0;
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    min-height: 7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > .label {
      margin: 0;
      color: var(--text-muted);
      font: 400 0.75rem/1.4 var(--font-mono);
      letter-spacing: 0;
      text-transform: uppercase;
    }

    > .value {
      margin-top: 0.625rem;
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1;
    }
  }
</style>
