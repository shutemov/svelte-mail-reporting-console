<script lang="ts">
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import type { AlertDetailsView } from '$lib/domains/types';

  export let item: AlertDetailsView;
</script>

<article class="m-alert-summary">
  <div>
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
    grid-template-columns: minmax(0, 1.2fr) minmax(180px, 0.8fr) auto;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface-raised);
    border: 0;
    border-radius: var(--radius-sm);
    padding: 0.75rem 0.875rem;

    .title {
      margin: 0;
      font-size: 0.9375rem;

      a {
        text-decoration: none;

        &:hover {
          color: var(--admin-primary);
        }
      }
    }

    .sender {
      margin: 0.35rem 0;
      color: var(--text-muted);
      font-size: 0.8125rem;
    }

    > .context {
      display: grid;
      gap: 0.125rem;
      color: var(--text-muted);
      font-size: 0.8125rem;
      text-transform: capitalize;
    }

    > .meta {
      display: flex;
      gap: 0.4rem;
      justify-content: end;
      flex-wrap: wrap;
    }

    @media (max-width: 760px) {
      grid-template-columns: 1fr;

      > .meta {
        justify-content: flex-start;
      }
    }
  }
</style>
