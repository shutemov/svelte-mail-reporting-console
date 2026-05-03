<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import type { ActionData, PageData } from './$types';
  import OAlertDetails from '$lib/ui/organisms/OAlertDetails.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<section>
  <MPageHeading title="Alert details" />
  <OAlertDetails details={data.details} formError={form?.formError ?? ''} />
</section>
