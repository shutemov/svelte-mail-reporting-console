<script lang="ts">
  export let name = '';
  export let value = '';
  export let checked = false;
  export let label = '';
  export let id = '';

  $: inputId =
    id ||
    `checkbox-${name}-${value}`
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
</script>

<div class="a-checkbox">
  <input id={inputId} type="checkbox" {name} {value} bind:checked />
  <label class="label" for={inputId}>{label}</label>
</div>

<style lang="scss">
  .a-checkbox {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    > .label {
      line-height: 1.3;
      user-select: none;
    }
  }
</style>
