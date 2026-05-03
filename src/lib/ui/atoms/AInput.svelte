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
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.55rem 0.7rem;
    background: white;
  }
</style>
