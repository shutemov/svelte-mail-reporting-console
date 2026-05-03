<script lang="ts">
  export let name = '';
  export let value = '';
  export let rows = 4;
</script>

<textarea class="a-textarea" {name} {rows}>{value}</textarea>

<style lang="scss">
  .a-textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.55rem 0.7rem;
    resize: vertical;
    min-height: 6rem;
  }
</style>
