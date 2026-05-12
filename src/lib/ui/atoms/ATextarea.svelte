<script lang="ts">
  export let name = '';
  export let value = '';
  export let rows = 4;
  export let placeholder = '';
</script>

<textarea class="a-textarea" {name} {rows} {placeholder}>{value}</textarea>

<style lang="scss">
  .a-textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.625rem 0.75rem;
    resize: vertical;
    min-height: 6rem;
    background: white;
    color: var(--text);

    &::placeholder {
      color: color-mix(in srgb, var(--text-muted) 76%, white);
    }
  }
</style>
