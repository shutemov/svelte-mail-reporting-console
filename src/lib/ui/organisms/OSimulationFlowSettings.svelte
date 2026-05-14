<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Severity, SimulationConfig } from '$lib/domains';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import ACheckbox from '$lib/ui/atoms/ACheckbox.svelte';
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';
  import MSeverityMixBar from '$lib/ui/molecules/MSeverityMixBar.svelte';

  type SimulationForm = {
    success?: boolean;
    values?: Partial<SimulationConfig>;
    fieldErrors?: Record<string, string>;
    formError?: string;
  };

  export let config: SimulationConfig;
  export let form: SimulationForm | null = null;

  let pending = false;
  let resetPending = false;
  let saved = false;

  $: values = {
    ...config,
    ...(form?.values ?? {}),
    severityMix: {
      ...config.severityMix,
      ...(form?.values?.severityMix ?? {})
    }
  };
  $: errors = form?.fieldErrors ?? {};
  $: expectedVolume = Number(values.ratePerMinute ?? config.ratePerMinute) * 15;

  function releaseNumberInputWheel(event: WheelEvent) {
    (event.currentTarget as HTMLInputElement).blur();
  }

  function changeSeverityByWheel(event: WheelEvent, severity: Severity) {
    event.preventDefault();

    const input = event.currentTarget as HTMLInputElement;
    const current = Number(input.value);
    const min = Number(input.min);
    const max = Number(input.max);
    const step = event.shiftKey ? 5 : 1;
    const direction = event.deltaY < 0 ? 1 : -1;
    const fallback = Number(values.severityMix[severity]) || 0;
    const next = Math.min(
      Number.isFinite(max) ? max : 100,
      Math.max(Number.isFinite(min) ? min : 0, (Number.isFinite(current) ? current : fallback) + direction * step)
    );

    values.severityMix[severity] = next;
    values.severityMix = { ...values.severityMix };
  }

  const enhanceSettings: SubmitFunction = () => {
    pending = true;
    saved = false;

    return async ({ result, update }) => {
      try {
        await update();
        saved = result.type === 'success';
      } finally {
        pending = false;
      }
    };
  };

  const enhanceResetDefaults: SubmitFunction = () => {
    resetPending = true;
    saved = false;

    return async ({ result, update }) => {
      try {
        await update();
        saved = result.type === 'success';
      } finally {
        resetPending = false;
      }
    };
  };
</script>

<section class="o-simulation-flow-settings">
  <div class="heading">
    <div>
      <p class="eyebrow">Generation settings</p>
      <h2>Workload profile</h2>
    </div>
    <span>Affects new synthetic alerts only</span>

    <form method="POST" action="?/resetConfigDefaults" use:enhance={enhanceResetDefaults}>
      <AButton type="submit" variant="secondary" disabled={resetPending || pending} loading={resetPending}>
        {resetPending ? 'Resetting...' : 'Reset to defaults'}
      </AButton>
    </form>
  </div>

  <form method="POST" action="?/updateConfig" use:enhance={enhanceSettings} class="settings-form">
    <AErrorMessage message={form?.formError ?? ''} />
    <input type="hidden" name="seed" value={values.seed} />

    <label>
      <span>Rate per minute</span>
      <input
        name="ratePerMinute"
        type="number"
        min="1"
        max="20"
        value={values.ratePerMinute}
        on:wheel={releaseNumberInputWheel}
      />
      <small>Controls incoming queue pressure. Guardrail: 1..20 alerts per minute.</small>
      <AErrorMessage message={errors.ratePerMinute ?? ''} />
    </label>

    <label>
      <span>Malicious ratio</span>
      <input
        name="maliciousRatio"
        type="number"
        min="0"
        max="1"
        step="0.05"
        value={values.maliciousRatio}
        on:wheel={releaseNumberInputWheel}
      />
      <small>Higher values make decision quality metrics harsher and more useful.</small>
      <AErrorMessage message={errors.maliciousRatio ?? ''} />
    </label>

    <fieldset>
      <legend>Severity mix</legend>
      <p>Percent split for generated alerts. Values must add up to 100%.</p>
      <MSeverityMixBar mix={values.severityMix} />

      <div class="severity-grid">
        <label>
          <span>Low</span>
          <input
            name="severityMix.low"
            type="number"
            min="0"
            max="100"
            bind:value={values.severityMix.low}
            on:wheel={(event) => changeSeverityByWheel(event, 'low')}
          />
          <AErrorMessage message={errors['severityMix.low'] ?? ''} />
        </label>
        <label>
          <span>Medium</span>
          <input
            name="severityMix.medium"
            type="number"
            min="0"
            max="100"
            bind:value={values.severityMix.medium}
            on:wheel={(event) => changeSeverityByWheel(event, 'medium')}
          />
          <AErrorMessage message={errors['severityMix.medium'] ?? ''} />
        </label>
        <label>
          <span>High</span>
          <input
            name="severityMix.high"
            type="number"
            min="0"
            max="100"
            bind:value={values.severityMix.high}
            on:wheel={(event) => changeSeverityByWheel(event, 'high')}
          />
          <AErrorMessage message={errors['severityMix.high'] ?? ''} />
        </label>
        <label>
          <span>Critical</span>
          <input
            name="severityMix.critical"
            type="number"
            min="0"
            max="100"
            bind:value={values.severityMix.critical}
            on:wheel={(event) => changeSeverityByWheel(event, 'critical')}
          />
          <AErrorMessage message={errors['severityMix.critical'] ?? ''} />
        </label>
      </div>

      <AErrorMessage message={errors.severityMix ?? ''} />
    </fieldset>

    <ACheckbox
      name="autoStartOnReset"
      checked={values.autoStartOnReset === true}
      label="Auto-start after simulation reset"
    />

    <div class="preview">
      <strong>Expected volume: {expectedVolume} alerts in next 15 minutes</strong>
      <span>Current mix follows the saved malicious ratio and severity split.</span>
    </div>

    <div class="actions">
      <AButton type="submit" disabled={pending} loading={pending}>
        {pending ? 'Saving...' : 'Save settings'}
      </AButton>
      {#if saved || form?.success}
        <span class="saved">Settings saved</span>
      {/if}
    </div>
  </form>
</section>

<style lang="scss">
  .o-simulation-flow-settings {
    background: var(--surface);
    border: 0;
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);

    > .heading {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: start;
      flex-wrap: wrap;
      margin-bottom: 1rem;

      h2,
      p {
        margin: 0;
      }

      .eyebrow,
      > span {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      h2 {
        margin-top: 0.25rem;
        font-size: 1.375rem;
      }

      > span {
        max-width: 12rem;
        text-align: end;
      }
    }

    .settings-form {
      display: grid;
      gap: 0.875rem;
    }

    label,
    fieldset {
      display: grid;
      gap: 0.375rem;
    }

    span,
    legend {
      font-weight: 500;
    }

    input {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      min-height: 2.75rem;
      padding: 0.625rem 0.75rem;
      background: white;
    }

    small,
    fieldset > p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.35;
    }

    fieldset {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      background: var(--surface-raised);
    }

    .severity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
    }

    .preview {
      background: var(--surface-muted);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      display: grid;
      gap: 0.25rem;

      strong,
      span {
        display: block;
      }

      span {
        color: var(--text-muted);
        font-size: 0.8125rem;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .saved {
      color: var(--employee-primary);
      font-weight: 500;
    }
  }
</style>
