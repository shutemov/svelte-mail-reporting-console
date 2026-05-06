import type { GroundTruthOutcome, RiskyAction } from '$lib/domains/types';

export type SimulationTemplate = {
  id: string;
  outcome: GroundTruthOutcome;
  sender: string;
  subject: string;
  reason: string;
  riskyActions: RiskyAction[];
  messagePreview: string;
};

export const simulationTemplates: SimulationTemplate[] = [
  {
    id: 'safe-newsletter',
    outcome: 'safe',
    sender: 'newsletter@trusted-vendor.example',
    subject: 'Monthly security digest',
    reason: 'Employee reports a message that looks unusual but has known branding.',
    riskyActions: ['reported_without_interaction'],
    messagePreview: 'Your monthly security digest is ready to read.'
  },
  {
    id: 'safe-calendar-update',
    outcome: 'safe',
    sender: 'calendar@company.example',
    subject: 'Updated invite: compliance sync',
    reason: 'Calendar notification looked unexpected but matches a real internal meeting.',
    riskyActions: ['opened_email'],
    messagePreview: 'The compliance sync has a new agenda and room.'
  },
  {
    id: 'malicious-credential-harvest',
    outcome: 'malicious',
    sender: 'security-update@account-verify.example',
    subject: 'Password expires today',
    reason: 'Message asks the employee to enter credentials on an unknown domain.',
    riskyActions: ['entered_credentials'],
    messagePreview: 'Confirm your mailbox password now to avoid service interruption.'
  },
  {
    id: 'malicious-attachment',
    outcome: 'malicious',
    sender: 'invoice@external-billing.example',
    subject: 'Overdue invoice attached',
    reason: 'Unexpected invoice attachment from an unrecognized sender.',
    riskyActions: ['downloaded_attachment'],
    messagePreview: 'Please review the attached invoice and enable content.'
  },
  {
    id: 'malicious-link-click',
    outcome: 'malicious',
    sender: 'it-helpdesk@company-support.example',
    subject: 'Mailbox quota exceeded',
    reason: 'Spoofed helpdesk message pushes the employee to a lookalike link.',
    riskyActions: ['clicked_link'],
    messagePreview: 'Increase your mailbox quota by validating your account.'
  }
];
