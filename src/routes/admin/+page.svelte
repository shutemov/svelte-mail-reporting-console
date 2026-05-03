<script lang="ts">
  import type { PageData } from './$types';
  import ODashboardSummary from '$lib/ui/organisms/ODashboardSummary.svelte';

  export let data: PageData;
</script>

<h1>Admin dashboard</h1>
<ODashboardSummary summary={data.summary} />