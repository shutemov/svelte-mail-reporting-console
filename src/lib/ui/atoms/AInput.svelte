<script lang="ts">
  export let name = '';
  export let value = '';
  export let type: 'text' | 'email' | 'date' | 'datetime-local' = 'text';
  export let placeholder = '';
  export let required = false;
</script>

<input class="a-input" {name} {value} {type} {placeholder} {required} />

<style lang="scss">
  .a-input {
    width: 100%;
    min-height: 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.625rem 0.75rem;
    background: white;
    color: var(--text);

    &::placeholder {
      color: color-mix(in srgb, var(--text-muted) 76%, white);
    }
  }
</style>
