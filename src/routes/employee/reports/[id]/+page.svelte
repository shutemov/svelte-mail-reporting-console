<script lang="ts">
  import OReportDetails from '$lib/ui/organisms/OReportDetails.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<OReportDetails report={data.report} />
