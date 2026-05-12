<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
  export let loading = false;
  export let label = '';
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined;

  $: variantClass =
    variant === 'primary'
      ? 'is-primary'
      : variant === 'secondary'
        ? 'is-secondary'
        : 'is-danger';
</script>

<button class={`a-button ${variantClass}`} {type} {disabled} aria-busy={loading} {onclick}>
  {#if label}
    {label}
  {:else}
    <slot />
  {/if}
</button>

<style lang="scss">
  .a-button {
    border: 1px solid transparent;
    border-radius: 999px;
    min-height: 2.5rem;
    padding: 0.5625rem 0.9375rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0;
    transition:
      background 160ms ease,
      color 160ms ease,
      opacity 160ms ease;

    &.is-primary {
      background: var(--admin-primary);
      color: white;

      &:hover {
        background: var(--admin-primary-strong);
      }
    }

    &.is-secondary {
      background: var(--surface);
      color: var(--text);

      &:hover {
        color: var(--admin-primary);
        background: var(--admin-tint);
      }
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
