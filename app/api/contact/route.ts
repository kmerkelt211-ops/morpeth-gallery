import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SUPPORT_ENQUIRY_OPTIONS, SUPPORT_INTEREST_OPTIONS } from '../../../lib/contact'
import { normalizeBody } from '../../../lib/contact-sanitize'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 8

type RateLimitRecord = {
  count: number
  resetAt: number
}

declare global {
  var __contactRateLimiterStore: Map<string, RateLimitRecord> | undefined
}

const rateLimiterStore = globalThis.__contactRateLimiterStore || new Map<string, RateLimitRecord>()
if (!globalThis.__contactRateLimiterStore) {
  globalThis.__contactRateLimiterStore = rateLimiterStore
}

const contactRequestSchema = z.object({
  name: z.string().min(1, 'Please enter your name.').max(120, 'Name is too long.'),
  email: z.string().email('Please enter a valid email address.').max(180, 'Email is too long.'),
  enquiryType: z.enum(SUPPORT_ENQUIRY_OPTIONS).optional(),
  organization: z.string().max(160, 'Organisation is too long.').optional(),
  phone: z.string().max(80, 'Phone number is too long.').optional(),
  budget: z.string().max(80, 'Budget note is too long.').optional(),
  subject: z.string().max(160, 'Subject is too long.').optional(),
  message: z.string().min(1, 'Please enter your message.').max(5000, 'Message is too long.'),
  interests: z.array(z.enum(SUPPORT_INTEREST_OPTIONS)).max(6, 'Please choose up to six options.').optional(),
  honeypot: z.string().max(0).optional(),
})

type ParsedContactRequest = z.infer<typeof contactRequestSchema>

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim()
    if (firstIp) return firstIp
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  return realIp || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()

  rateLimiterStore.forEach((value, key) => {
    if (value.resetAt <= now) rateLimiterStore.delete(key)
  })

  const current = rateLimiterStore.get(ip)

  if (!current) {
    rateLimiterStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (current.resetAt <= now) {
    rateLimiterStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  current.count += 1
  rateLimiterStore.set(ip, current)
  return false
}

async function sendWithResend(data: ParsedContactRequest, metadata: { ip: string; userAgent: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !toEmail || !fromEmail) {
    throw new Error('Missing contact email environment variables.')
  }

  const supportInterests = data.interests?.length ? data.interests.join(', ') : 'None selected'
  const submittedAt = new Date().toISOString()
  const enquiryType = data.enquiryType || 'General enquiry'
  const subjectLine = data.subject || `${enquiryType} enquiry`

  const text = [
    'New support enquiry from the Portman Gallery website',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Enquiry type: ${enquiryType}`,
    `Organisation: ${data.organization || 'Not provided'}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Budget: ${data.budget || 'Not provided'}`,
    `Subject: ${subjectLine}`,
    '',
    'Message:',
    data.message,
    '',
    `Support interests: ${supportInterests}`,
    '',
    `Submitted at: ${submittedAt}`,
    `IP: ${metadata.ip}`,
    `User agent: ${metadata.userAgent || 'Unknown'}`,
  ].join('\n')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: data.email,
      subject: `[Morpeth Support] ${subjectLine}`,
      text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || `Resend request failed with status ${response.status}`)
  }
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten().fieldErrors as Record<string, string[] | undefined>
  const output: Record<string, string> = {}

  Object.entries(flattened).forEach(([field, messages]) => {
    const firstMessage = messages?.[0]
    if (firstMessage) output[field] = firstMessage
  })

  return output
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Invalid request payload.',
      },
      { status: 400 }
    )
  }

  const normalizedBody = normalizeBody(body)

  if (normalizedBody.honeypot) {
    return NextResponse.json({
      ok: true,
      message: "Thanks - we'll get back to you.",
    })
  }

  const parsed = contactRequestSchema.safeParse(normalizedBody)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Please check the highlighted fields and try again.',
        errors: zodFieldErrors(parsed.error),
      },
      { status: 422 }
    )
  }

  const ip = getClientIp(request)
  const isRateLimited = checkRateLimit(ip)

  if (isRateLimited) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Too many requests from this connection. Please wait a few minutes and try again.',
      },
      { status: 429 }
    )
  }

  const userAgent = request.headers.get('user-agent') || 'Unknown'

  try {
    await sendWithResend(parsed.data, { ip, userAgent })
    return NextResponse.json({
      ok: true,
      message: "Thanks - we'll get back to you.",
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'We could not send your message right now. Please try again shortly.',
      },
      { status: 502 }
    )
  }
}
