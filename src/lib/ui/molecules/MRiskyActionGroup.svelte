<script lang="ts">
  import ACheckbox from '$lib/ui/atoms/ACheckbox.svelte';
  import type { RiskyAction } from '$lib/domains/types';

  export let selected: RiskyAction[] = [];

  const options: Array<{ value: RiskyAction; label: string }> = [
    { value: 'opened_email', label: 'Opened email' },
    { value: 'clicked_link', label: 'Clicked link' },
    { value: 'downloaded_attachment', label: 'Downloaded attachment' },
    { value: 'entered_credentials', label: 'Entered credentials' },
    { value: 'reported_without_interaction', label: 'Reported without interaction' }
  ];
</script>

<div class="m-risky-action-group">
  {#each options as option (option.value)}
    <ACheckbox
      name="riskyActions"
      value={option.value}
      label={option.label}
      checked={selected.includes(option.value)}
    />
  {/each}
</div>

<style lang="scss">
  .m-risky-action-group {
    display: grid;
    gap: 0.5rem;
  }
</style>
