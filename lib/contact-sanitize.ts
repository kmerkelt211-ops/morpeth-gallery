import { SUPPORT_ENQUIRY_OPTIONS, SUPPORT_INTEREST_OPTIONS } from './contact'

export type ParsedContactRequest = {
  name: string
  email: string
  enquiryType?: (typeof SUPPORT_ENQUIRY_OPTIONS)[number]
  organization: string
  phone: string
  budget: string
  subject: string
  message: string
  interests: (typeof SUPPORT_INTEREST_OPTIONS)[number][]
  honeypot: string
}

export function cleanInlineText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function cleanMessage(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength)
}

export function cleanInterests(value: unknown): ParsedContactRequest['interests'] {
  if (!Array.isArray(value)) return []
  const optionSet = new Set<string>(SUPPORT_INTEREST_OPTIONS)
  const cleaned = value
    .map((item) => cleanInlineText(item, 40))
    .filter((item): item is (typeof SUPPORT_INTEREST_OPTIONS)[number] => optionSet.has(item))
  return Array.from(new Set(cleaned))
}

export function cleanEnquiryType(value: unknown): ParsedContactRequest['enquiryType'] {
  const cleaned = cleanInlineText(value, 40)
  return SUPPORT_ENQUIRY_OPTIONS.includes(cleaned as (typeof SUPPORT_ENQUIRY_OPTIONS)[number])
    ? (cleaned as (typeof SUPPORT_ENQUIRY_OPTIONS)[number])
    : undefined
}

export function normalizeBody(body: unknown): ParsedContactRequest {
  const value = body && typeof body === 'object' ? body : {}
  const record = value as Record<string, unknown>

  return {
    name: cleanInlineText(record.name, 120),
    email: cleanInlineText(record.email, 180),
    enquiryType: cleanEnquiryType(record.enquiryType),
    organization: cleanInlineText(record.organization, 160),
    phone: cleanInlineText(record.phone, 80),
    budget: cleanInlineText(record.budget, 80),
    subject: cleanInlineText(record.subject, 160),
    message: cleanMessage(record.message, 5000),
    interests: cleanInterests(record.interests),
    honeypot: cleanInlineText(record.honeypot, 200),
  }
}
