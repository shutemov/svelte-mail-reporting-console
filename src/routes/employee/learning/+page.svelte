<script lang="ts">
  import type { PageData } from './$types';
  import OLearningAssignmentsList from '$lib/ui/organisms/OLearningAssignmentsList.svelte';

  export let data: PageData;
</script>

<OLearningAssignmentsList assignments={data.assignments} />
