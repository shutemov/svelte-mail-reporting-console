<script lang="ts">
  export let title = '';
  export let subtitle = '';
</script>

<header class="m-page-heading">
  <h1>{title}</h1>
  {#if subtitle}
    <p>{subtitle}</p>
  {/if}
</header>

<style lang="scss">
  .m-page-heading {
    display: grid;
    gap: 0.375rem;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    background: var(--surface);

    > h1 {
      max-width: 47.5rem;
      font-size: 1.625rem;
      line-height: 1.12;
    }

    > p {
      color: var(--text-muted);
      max-width: 68ch;
      font-size: 0.8125rem;
      line-height: 1.42;
    }
  }
</style>
