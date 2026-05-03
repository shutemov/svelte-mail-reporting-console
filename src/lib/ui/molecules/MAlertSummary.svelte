<script lang="ts">
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import type { AlertDetailsView } from '$lib/domains/types';

  export let item: AlertDetailsView;
</script>

<article class="m-alert-summary">
  <h3 class="title"><a href={`/admin/alerts/${item.alert.id}`}>{item.report.subject}</a></h3>
  <p class="sender">{item.report.sender}</p>
  <div class="meta">
    <AStatusPill status={item.alert.status} />
    <AStatusPill severity={item.alert.severity} />
  </div>
</article>

<style lang="scss">
  .m-alert-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.9rem;

    > .title {
      margin: 0;
    }

    > .sender {
      margin: 0.35rem 0;
      color: var(--text-muted);
    }

    > .meta {
      display: flex;
      gap: 0.4rem;
    }
  }
</style>
