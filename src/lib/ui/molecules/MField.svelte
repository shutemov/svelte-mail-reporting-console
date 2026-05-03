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
    gap: 0.4rem;

    > .label {
      font-weight: 600;
    }
  }
</style>
