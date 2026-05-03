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
    gap: var(--space-2);

    > p {
      color: var(--text-muted);
      max-width: 44rem;
    }
  }
</style>
