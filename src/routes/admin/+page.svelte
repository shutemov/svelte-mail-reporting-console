<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import ODashboardSummary from '$lib/ui/organisms/ODashboardSummary.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section>
  <MPageHeading title="Admin dashboard" />
  <ODashboardSummary summary={data.summary} />
</section>
