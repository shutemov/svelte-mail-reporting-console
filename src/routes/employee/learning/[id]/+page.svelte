<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import OLearningModule from '$lib/ui/organisms/OLearningModule.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<h1>Learning module</h1>
<OLearningModule item={data.item} formError={form?.formError ?? ''} />