<script lang="ts">
  import type { EmployeeProfileSummary } from '$lib/domains';
  import MEmployeeRiskCard from '$lib/ui/molecules/MEmployeeRiskCard.svelte';

  export let summaries: EmployeeProfileSummary[] = [];
</script>

<section class="o-employee-risk-cards">
  <div class="heading">
    <h2>Employee risk profiles</h2>
    <p>Open any employee profile to inspect reports, alerts, risk signals, and learning follow-up.</p>
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
    gap: 0.75rem;
    padding: 1rem;
    border-radius: var(--radius);
    background: var(--surface);

    > .heading {
      display: grid;
      gap: 0.25rem;

      h2,
      p {
        margin: 0;
      }

      p {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    > .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 0.75rem;
    }
  }
</style>
