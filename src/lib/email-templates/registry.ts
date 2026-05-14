import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient, overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as auditConfirmation } from './audit-confirmation'
import { template as sequenceDay2 } from './sequence-day-2'
import { template as sequenceDay5 } from './sequence-day-5'
import { template as sequenceDay9 } from './sequence-day-9'
import { template as sequenceDay14 } from './sequence-day-14'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'audit-confirmation': auditConfirmation,
  'sequence-day-2': sequenceDay2,
  'sequence-day-5': sequenceDay5,
  'sequence-day-9': sequenceDay9,
  'sequence-day-14': sequenceDay14,
}
