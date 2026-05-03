<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import type { ActionData } from './$types';
  import OReportForm from '$lib/ui/organisms/OReportForm.svelte';

  export let form: ActionData;

  const values = form?.values ?? {};
  const fieldErrors = (form?.fieldErrors ?? {}) as Record<string, string>;
  const formError = form?.formError ?? '';
</script>

<section>
  <MPageHeading title="Report suspicious mail" />
  <OReportForm {values} {fieldErrors} {formError} />
</section>
