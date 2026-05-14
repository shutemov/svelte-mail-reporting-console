<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { RiskyAction, SubmitReportInput } from '$lib/domains';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AInput from '$lib/ui/atoms/AInput.svelte';
  import ATextarea from '$lib/ui/atoms/ATextarea.svelte';
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';
  import MDateTimePicker from '$lib/ui/molecules/MDateTimePicker.svelte';
  import MField from '$lib/ui/molecules/MField.svelte';
  import MRiskyActionGroup from '$lib/ui/molecules/MRiskyActionGroup.svelte';

  export let values: Partial<SubmitReportInput> = {};
  export let fieldErrors: Record<string, string> = {};
  export let formError = '';

  let pending = false;

  const enhanceReport: SubmitFunction = () => {
    pending = true;

    return async ({ update }) => {
      try {
        await update();
      } finally {
        pending = false;
      }
    };
  };
</script>

<form method="POST" class="o-report-form" use:enhance={enhanceReport}>
  <MField label="Sender" error={fieldErrors.sender}>
    <AInput name="sender" value={values.sender ?? ''} placeholder="security@example.com" />
  </MField>

  <MField label="Subject" error={fieldErrors.subject}>
    <AInput name="subject" value={values.subject ?? ''} placeholder="Password reset request" />
  </MField>

  <MField label="Received date" error={fieldErrors.receivedAt}>
    <MDateTimePicker name="receivedAt" value={values.receivedAt ?? ''} />
  </MField>

  <MField label="Reason" error={fieldErrors.reason}>
    <ATextarea
      name="reason"
      value={values.reason ?? ''}
      placeholder="What looked suspicious, unusual, or risky?"
      rows={4}
    />
  </MField>

  <MField label="Risky actions" error={fieldErrors.riskyActions}>
    <MRiskyActionGroup selected={(values.riskyActions ?? []) as RiskyAction[]} />
  </MField>

  <MField label="Message preview" error={fieldErrors.messagePreview}>
    <ATextarea
      name="messagePreview"
      value={values.messagePreview ?? ''}
      placeholder="Paste the relevant message excerpt, headers, or visible links."
      rows={6}
    />
  </MField>

  <AErrorMessage message={formError} />
  <AButton type="submit" disabled={pending} loading={pending}>
    {pending ? 'Submitting...' : 'Submit report'}
  </AButton>
</form>

<style lang="scss">
  .o-report-form {
    display: grid;
    gap: 0.875rem;
    padding: 1rem;
    border-radius: var(--radius);
    background: var(--surface);
  }
</style>
