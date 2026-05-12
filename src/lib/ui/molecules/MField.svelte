<script lang="ts">
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';
  export let label = '';
  export let error = '';
</script>

<label class="m-field">
  <span class="label">{label}</span>
  <slot />
  <AErrorMessage message={error} />
</label>

<style lang="scss">
  .m-field {
    display: grid;
    gap: 0.375rem;

    > .label {
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
</style>
