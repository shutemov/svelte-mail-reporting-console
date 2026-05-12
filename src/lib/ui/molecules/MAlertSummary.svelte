<script lang="ts">
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import type { AlertDetailsView } from '$lib/domains/types';

  export let item: AlertDetailsView;
</script>

<article class="m-alert-summary">
  <div class="summary-main">
    <h3 class="title"><a href={`/admin/alerts/${item.alert.id}`}>{item.report.subject}</a></h3>
    <p class="sender">{item.report.sender}</p>
  </div>
  <div class="context">
    <span>{item.reporter.name}</span>
    <span>{item.report.riskyActions.map((action) => action.replaceAll('_', ' ')).join(', ')}</span>
  </div>
  <div class="meta">
    <AStatusPill status={item.alert.status} />
    <AStatusPill severity={item.alert.severity} />
  </div>
</article>

<style lang="scss">
  .m-alert-summary {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(12rem, 0.65fr) minmax(9rem, auto);
    align-items: center;
    gap: 0.75rem;
    min-height: 4.125rem;
    background: var(--surface-raised);
    border: 0;
    border-radius: var(--radius-sm);
    padding: 0.75rem 0.875rem;

    > .summary-main,
    > .context {
      display: grid;
      align-content: center;
      min-height: 2.625rem;
    }

    .title {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.25;

      a {
        text-decoration: none;

        &:hover {
          color: var(--admin-primary);
        }
      }
    }

    .sender {
      margin: 0.25rem 0 0;
      color: var(--text-muted);
      font-size: 0.8125rem;
      line-height: 1.3;
    }

    > .context {
      gap: 0.125rem;
      color: var(--text-muted);
      font-size: 0.8125rem;
      line-height: 1.35;
      text-transform: capitalize;
    }

    > .meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      justify-content: end;
      flex-wrap: wrap;
      min-height: 2.625rem;
    }

    @media (max-width: 760px) {
      grid-template-columns: 1fr;

      > .meta {
        justify-content: flex-start;
      }
    }
  }
</style>
