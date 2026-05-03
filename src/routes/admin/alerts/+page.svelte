<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import OAlertQueue from '$lib/ui/organisms/OAlertQueue.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section>
  <MPageHeading title="Alert queue" />
  <OAlertQueue items={data.alerts} filters={data.filters} />
</section>
