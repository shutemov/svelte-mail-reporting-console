<script lang="ts">
  export let message = '';
</script>

{#if message}
  <p class="a-error-message" role="alert">{message}</p>
{/if}

<style lang="scss">
  .a-error-message {
    margin: 0;
    color: var(--danger);
    font-size: 0.85rem;
  }
</style>
