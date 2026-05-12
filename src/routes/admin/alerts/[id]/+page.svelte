<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import OAlertDetails from '$lib/ui/organisms/OAlertDetails.svelte';

  export let data: PageData;
  export let form: ActionData;
</script>

<section class="alert-details-page">
  <OAlertDetails details={data.details} formError={form?.formError ?? ''} />
</section>

<style lang="scss">
  .alert-details-page {
    display: grid;
  }
</style>
