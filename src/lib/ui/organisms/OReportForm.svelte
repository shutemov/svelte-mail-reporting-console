<script lang="ts">
  import type { RiskyAction, SubmitReportInput } from '$lib/domains/types';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AInput from '$lib/ui/atoms/AInput.svelte';
  import ATextarea from '$lib/ui/atoms/ATextarea.svelte';
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';
  import MField from '$lib/ui/molecules/MField.svelte';
  import MRiskyActionGroup from '$lib/ui/molecules/MRiskyActionGroup.svelte';

  export let values: Partial<SubmitReportInput> = {};
  export let fieldErrors: Record<string, string> = {};
  export let formError = '';

  const getDateInputValue = (iso?: string) => {
    if (!iso) return '';
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return '';
    return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };
</script>

<form method="POST" class="o-report-form">
  <MField label="Sender" error={fieldErrors.sender}>
    <AInput name="sender" value={values.sender ?? ''} />
  </MField>

  <MField label="Subject" error={fieldErrors.subject}>
    <AInput name="subject" value={values.subject ?? ''} />
  </MField>

  <MField label="Received date" error={fieldErrors.receivedAt}>
    <AInput
      name="receivedAt"
      type="datetime-local"
      value={getDateInputValue(values.receivedAt)}
    />
  </MField>

  <MField label="Reason" error={fieldErrors.reason}>
    <ATextarea name="reason" value={values.reason ?? ''} rows={4} />
  </MField>

  <MField label="Risky actions" error={fieldErrors.riskyActions}>
    <MRiskyActionGroup selected={(values.riskyActions ?? []) as RiskyAction[]} />
  </MField>

  <MField label="Message preview" error={fieldErrors.messagePreview}>
    <ATextarea name="messagePreview" value={values.messagePreview ?? ''} rows={6} />
  </MField>

  <AErrorMessage message={formError} />
  <AButton type="submit">Submit report</AButton>
</form>

<style lang="scss">
  .o-report-form {
    display: grid;
    gap: 1rem;
    max-width: 720px;
  }
</style>
