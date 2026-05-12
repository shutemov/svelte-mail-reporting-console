<script lang="ts">
  import AInput from '$lib/ui/atoms/AInput.svelte';
  import MField from '$lib/ui/molecules/MField.svelte';

  export let label = 'Sender address';
  export let error = '';
  export let value = 'billing@example-payments.net';
  export let placeholder = 'sender@example.com';
</script>

<MField {label} {error}>
  <AInput name="sender" {value} {placeholder} />
</MField>
