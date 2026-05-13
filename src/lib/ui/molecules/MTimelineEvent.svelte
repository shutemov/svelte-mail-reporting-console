<script lang="ts">
  import { formatDateTime } from '$lib/common/date-time';
  import type { TimelineEvent } from '$lib/domains';

  export let event: TimelineEvent;
</script>

<li class="m-timeline-event">
  <time>{formatDateTime(event.createdAt)}</time>
  <p class="message">{event.message}</p>
  <small class="type">{event.type}</small>
</li>

<style lang="scss">
  .m-timeline-event {
    list-style: none;
    border-left: 3px solid var(--border);
    padding: 0.4rem 0 0.4rem 0.8rem;

    > time {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    > .message {
      margin: 0.2rem 0;
    }
  }
</style>
