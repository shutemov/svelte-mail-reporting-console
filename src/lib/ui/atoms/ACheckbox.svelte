<script lang="ts">
  export let name = '';
  export let value = '';
  export let checked = false;
  export let label = '';
</script>

<label class="a-checkbox">
  <input type="checkbox" {name} {value} {checked} />
  <span class="label">{label}</span>
</label>

<style lang="scss">
  .a-checkbox {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    > .label {
      line-height: 1.3;
    }
  }
</style>
