<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import OLearningModule from '$lib/ui/organisms/OLearningModule.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<section class="learning-module-page">
  <OLearningModule item={data.item} formError={form?.formError ?? ''} />
</section>

<style lang="scss">
  .learning-module-page {
    display: grid;
  }
</style>
