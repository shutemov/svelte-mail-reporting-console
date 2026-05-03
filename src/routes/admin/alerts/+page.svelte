<script lang="ts">
  import type { PageData } from './$types';
  import OAlertQueue from '$lib/ui/organisms/OAlertQueue.svelte';

  export let data: PageData;
</script>

<h1>Alert queue</h1>
<OAlertQueue items={data.alerts} filters={data.filters} />