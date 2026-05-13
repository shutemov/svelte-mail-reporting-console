<script lang="ts">
  import { formatRiskyActions } from '$lib/domains/labels';
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import type { AlertDetailsView } from '$lib/domains/types';

  export let item: AlertDetailsView;
</script>

<a class="m-alert-summary" href={`/admin/alerts/${item.alert.id}`} aria-label={item.report.subject}>
  <div class="summary-main">
    <h3 class="title">{item.report.subject}</h3>
    <p class="sender">{item.report.sender}</p>
  </div>
  <div class="context">
    <span>{item.reporter.name}</span>
    <span>{formatRiskyActions(item.report.riskyActions)}</span>
  </div>
  <div class="meta">
    <AStatusPill status={item.alert.status} />
    <AStatusPill severity={item.alert.severity} />
  </div>
</a>

<style lang="scss">
  .m-alert-summary {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(12rem, 0.65fr) minmax(9rem, auto);
    align-items: center;
    gap: 0.75rem;
    min-height: 4.125rem;
    background: var(--surface-raised);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: inherit;
    padding: 0.75rem 0.875rem;
    text-decoration: none;
    transition:
      background-color 140ms ease,
      border-color 140ms ease,
      box-shadow 140ms ease,
      transform 140ms ease;

    &:hover {
      background: color-mix(in srgb, var(--admin-primary) 4%, var(--surface-raised));
      border-color: color-mix(in srgb, var(--admin-primary) 18%, transparent);
      box-shadow: 0 0.5rem 1.375rem rgba(24, 99, 220, 0.08);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: none;
      border-color: var(--admin-primary);
      box-shadow: var(--shadow-focus);
    }

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
