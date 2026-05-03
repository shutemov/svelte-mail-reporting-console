<script lang="ts">
  import type { ActionData } from './$types';
  import OReportForm from '$lib/ui/organisms/OReportForm.svelte';

  export let form: ActionData;

  const values = form?.values ?? {};
  const fieldErrors = (form?.fieldErrors ?? {}) as Record<string, string>;
  const formError = form?.formError ?? '';
</script>

<h1>Report suspicious mail</h1>
<OReportForm {values} {fieldErrors} {formError} />