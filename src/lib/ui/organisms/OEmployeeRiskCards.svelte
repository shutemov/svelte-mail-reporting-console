<script lang="ts">
  import type { EmployeeProfileSummary } from '$lib/domains/types';
  import MEmployeeRiskCard from '$lib/ui/molecules/MEmployeeRiskCard.svelte';

  export let summaries: EmployeeProfileSummary[] = [];
</script>

<section class="o-employee-risk-cards">
  <div class="heading">
    <h2>Employee risk profiles</h2>
    <p>Alice and Bob have full profile drill-down. Synthetic teammates provide organization-wide signal.</p>
  </div>

  <div class="cards">
    {#each summaries as summary (summary.user.id)}
      <MEmployeeRiskCard {summary} />
    {/each}
  </div>
</section>

<style lang="scss">
  .o-employee-risk-cards {
    display: grid;
    gap: var(--space-3);

    > .heading {
      display: grid;
      gap: var(--space-1);

      h2,
      p {
        margin: 0;
      }

      p {
        color: var(--text-muted);
      }
    }

    > .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: var(--space-3);
    }
  }
</style>
