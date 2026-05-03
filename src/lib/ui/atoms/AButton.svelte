<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
  export let loading = false;
  export let label = '';

  $: variantClass =
    variant === 'primary'
      ? 'is-primary'
      : variant === 'secondary'
        ? 'is-secondary'
        : 'is-danger';
</script>

<button class={`a-button ${variantClass}`} {type} {disabled} aria-busy={loading}>
  {#if label}
    {label}
  {:else}
    <slot />
  {/if}
</button>

<style lang="scss">
  .a-button {
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.9rem;
    cursor: pointer;
    font-weight: 600;

    &.is-primary {
      background: var(--accent);
      color: white;
    }

    &.is-secondary {
      background: var(--surface-muted);
      border-color: var(--border);
    }

    &.is-danger {
      background: var(--danger);
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>
