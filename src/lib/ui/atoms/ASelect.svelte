<script lang="ts">
  type Option = { value: string; label: string };
  export let name = '';
  export let options: Option[] = [];
  export let value = '';
</script>

<select class="a-select" {name} {value}>
  <slot />
  {#if !$$slots.default}
    <option value="">All</option>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  {/if}
</select>

<style lang="scss">
  .a-select {
    width: 100%;
    min-height: 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding-block: 0.625rem;
    padding-inline: 0.75rem 2.1rem;
    background: white;
    color: var(--text);
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, #4f607d 50%),
      linear-gradient(135deg, #4f607d 50%, transparent 50%);
    background-position:
      calc(100% - 0.95rem) calc(50% - 0.14rem),
      calc(100% - 0.65rem) calc(50% - 0.14rem);
    background-size: 0.3rem 0.3rem, 0.3rem 0.3rem;
    background-repeat: no-repeat;
  }
</style>
