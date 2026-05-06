<script lang="ts">
  import { fade } from 'svelte/transition';

  export let value: string | number = '';
  export let ariaLabel = 'Metric value';

  $: valueKey = String(value);
</script>

<span class="m-animated-metric-value" aria-live="polite" aria-label={ariaLabel}>
  <span class="sizer" aria-hidden="true">{value}</span>
  {#key valueKey}
    <strong class="value" in:fade={{ duration: 260 }} out:fade={{ duration: 260 }}>
      {value}
    </strong>
  {/key}
</span>

<style lang="scss">
  .m-animated-metric-value {
    position: relative;
    display: block;
    min-height: 2.55rem;
    overflow: hidden;

    > .sizer,
    > .value {
      display: block;
      font-size: 1.75rem;
      line-height: 1.45;
      font-weight: 700;
      white-space: nowrap;
    }

    > .sizer {
      visibility: hidden;
      pointer-events: none;
    }

    > .value {
      position: absolute;
      inset: 0 auto auto 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .m-animated-metric-value > .value {
      transition: none;
    }
  }
</style>
