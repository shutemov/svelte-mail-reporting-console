<script lang="ts">
  import type { PageData } from './$types';
  import OReportsList from '$lib/ui/organisms/OReportsList.svelte';

  export let data: PageData;
</script>

<OReportsList reports={data.reports} />
