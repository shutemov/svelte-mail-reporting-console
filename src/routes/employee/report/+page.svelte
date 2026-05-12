<script lang="ts">
  import type { ActionData } from './$types';
  import OReportForm from '$lib/ui/organisms/OReportForm.svelte';

  export let form: ActionData;

  const values = form?.values ?? {};
  const fieldErrors = (form?.fieldErrors ?? {}) as Record<string, string>;
  const formError = form?.formError ?? '';
</script>

<section class="employee-report-page">
  <header class="page-header">
    <div>
      <p>Employee report</p>
      <h1>Submit a suspicious message.</h1>
      <span>Calm reporting creates an admin alert without blame or extra back-and-forth.</span>
    </div>
    <div class="meta">
      <span>Manual source</span>
      <span>Same admin queue</span>
    </div>
  </header>

  <div class="form-grid">
    <OReportForm {values} {fieldErrors} {formError} />

    <aside class="next-steps-card">
      <p class="eyebrow">Employee zone</p>
      <h2>What happens next</h2>
      <ol class="next-steps-list">
        <li>
          <span>1</span>
          <div>
            <b>Report accepted</b>
            <p>Sender, subject, reason, and action are checked.</p>
          </div>
        </li>
        <li>
          <span>2</span>
          <div>
            <b>Alert created</b>
            <p>The case enters the same admin queue.</p>
          </div>
        </li>
        <li>
          <span>3</span>
          <div>
            <b>Status visible</b>
            <p>Calm, non-blaming updates appear in report history.</p>
          </div>
        </li>
      </ol>
      <div class="mail-frame">
        <div class="mail-head"><b>Message preview</b></div>
        <div class="mail-body">
          <p>Please review the secure approval page and confirm the remittance details.</p>
          <span>https://acme-finance-approval.com/session/7f93</span>
        </div>
      </div>
    </aside>
  </div>
</section>

<style lang="scss">
  .employee-report-page {
    display: grid;
    gap: 0.875rem;

    .page-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      background: var(--surface);

      p {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      h1 {
        margin-top: 0.375rem;
        font-size: 1.625rem;
      }

      span {
        display: block;
        margin-top: 0.375rem;
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: end;
      gap: 0.375rem;

      span {
        min-height: 1.75rem;
        margin: 0;
        padding: 0.3125rem 0.625rem;
        border-radius: 999px;
        background: var(--employee-tint);
        color: var(--employee-primary);
        font-size: 0.75rem;
        font-weight: 500;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.7fr);
      gap: 0.875rem;
      align-items: start;
    }

    .next-steps-card {
      display: grid;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);
    }

    .eyebrow {
      color: var(--text-muted);
      font: 400 0.75rem/1.4 var(--font-mono);
      text-transform: uppercase;
    }

    .next-steps-list {
      display: grid;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 0.625rem;
        padding: 0.75rem;
        border-radius: var(--radius-sm);
        background: var(--surface-raised);
      }

      li > span {
        display: grid;
        place-items: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 999px;
        background: var(--employee-tint);
        color: var(--employee-primary);
        font-size: 0.75rem;
        font-weight: 500;
      }

      b {
        font-size: 0.875rem;
        font-weight: 500;
      }

      p {
        margin-top: 0.125rem;
        color: var(--text-muted);
        font-size: 0.8125rem;
      }
    }

    .mail-frame {
      overflow: hidden;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);
    }

    .mail-head,
    .mail-body {
      padding: 0.875rem;
    }

    .mail-head {
      border-bottom: 1px solid var(--border-soft);
    }

    .mail-body {
      color: var(--text-muted);
      font-size: 0.875rem;

      span {
        display: block;
        margin-top: 0.5rem;
        color: var(--admin-primary);
        overflow-wrap: anywhere;
      }
    }

    @media (max-width: 1000px) {
      .page-header,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .meta {
        justify-content: flex-start;
      }
    }
  }
</style>
