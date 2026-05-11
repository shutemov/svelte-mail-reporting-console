<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import OEmployeeProfileDetails from '$lib/ui/organisms/OEmployeeProfileDetails.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section class="employee-profile-page">
  <MPageHeading title="Employee profile" subtitle="Employee-level report, alert, risk, and learning context." />
  <OEmployeeProfileDetails details={data.details} />
</section>

<style lang="scss">
  .employee-profile-page {
    display: grid;
    gap: var(--space-4);
  }
</style>
