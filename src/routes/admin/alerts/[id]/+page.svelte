<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import OAlertDetails from '$lib/ui/organisms/OAlertDetails.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<h1>Alert details</h1>
<OAlertDetails details={data.details} formError={form?.formError ?? ''} />