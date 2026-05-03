<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import type { ActionData, PageData } from './$types';
  import OLearningModule from '$lib/ui/organisms/OLearningModule.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<section>
  <MPageHeading title="Learning module" />
  <OLearningModule item={data.item} formError={form?.formError ?? ''} />
</section>
