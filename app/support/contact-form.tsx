'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  SUPPORT_ENQUIRY_OPTIONS,
  SUPPORT_INTEREST_OPTIONS,
  type ContactFormErrors,
  type SupportEnquiryOption,
  type SupportInterestOption,
} from '../../lib/contact'

type ContactFormValues = {
  name: string
  email: string
  enquiryType: SupportEnquiryOption
  organization: string
  phone: string
  budget: string
  subject: string
  message: string
  interests: SupportInterestOption[]
  honeypot: string
}

type ContactApiResponse = {
  ok?: boolean
  message?: string
  errors?: ContactFormErrors
}

type ContactFormProps = {
  submitLabel?: string
  successMessage?: string
}

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  enquiryType: 'General enquiry',
  organization: '',
  phone: '',
  budget: '',
  subject: '',
  message: '',
  interests: [],
  honeypot: '',
}

const FIELD_WRAPPER_CLASS = 'block space-y-2'
const FIELD_LABEL_CLASS = 'font-heading text-[10px] uppercase tracking-[0.22em] text-slate-600'
const FIELD_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-[15px] leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
const ERROR_CLASS = 'text-sm text-rose-700'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function ContactForm({
  submitLabel = 'Send enquiry',
  successMessage = "Thanks - we'll get back to you.",
}: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  const selectedInterestSet = useMemo(() => new Set(values.interests), [values.interests])

  const updateValue = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  const toggleInterest = (option: SupportInterestOption) => {
    setValues((current) => {
      const hasValue = current.interests.includes(option)
      const nextInterests = hasValue
        ? current.interests.filter((item) => item !== option)
        : [...current.interests, option]
      return { ...current, interests: nextInterests }
    })
    setErrors((current) => ({ ...current, interests: undefined, form: undefined }))
  }

  const getClientErrors = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {}

    if (!values.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.'
    else if (!isValidEmail(values.email.trim())) {
      nextErrors.email = 'Please use a valid email address.'
    }
    if (!values.enquiryType) nextErrors.enquiryType = 'Please choose an enquiry type.'
    if (!values.message.trim()) nextErrors.message = 'Please enter a message.'

    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSuccess(false)
    setFormMessage('')

    const clientErrors = getClientErrors()
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const payload = (await response.json().catch(() => null)) as ContactApiResponse | null

      if (!response.ok || !payload?.ok) {
        if (payload?.errors && Object.keys(payload.errors).length) {
          setErrors(payload.errors)
        }
        setFormMessage(
          payload?.message || 'Something went wrong while sending your message. Please try again.'
        )
        return
      }

      setValues(INITIAL_VALUES)
      setIsSuccess(true)
      setFormMessage(payload.message || successMessage)
    } catch {
      setFormMessage('We could not send your message right now. Please try again shortly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[1.25rem] border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-5 py-5 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.55)] sm:px-7 sm:py-7"
    >
      <div className="space-y-6">
        {isSuccess ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            {formMessage}
          </div>
        ) : null}

        {!isSuccess && formMessage ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {formMessage}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Name <span aria-hidden className="text-slate-500">*</span>
            </span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => updateValue('name', event.target.value)}
              className={FIELD_CLASS}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              required
            />
            {errors.name ? (
              <p id="contact-name-error" className={ERROR_CLASS}>
                {errors.name}
              </p>
            ) : null}
          </label>

          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Email <span aria-hidden className="text-slate-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateValue('email', event.target.value)}
              className={FIELD_CLASS}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              required
            />
            {errors.email ? (
              <p id="contact-email-error" className={ERROR_CLASS}>
                {errors.email}
              </p>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Enquiry type <span aria-hidden className="text-slate-500">*</span>
            </span>
            <select
              name="enquiryType"
              value={values.enquiryType}
              onChange={(event) => updateValue('enquiryType', event.target.value)}
              className={`${FIELD_CLASS} appearance-none`}
              aria-invalid={Boolean(errors.enquiryType)}
              aria-describedby={errors.enquiryType ? 'contact-enquiry-type-error' : undefined}
              required
            >
              {SUPPORT_ENQUIRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.enquiryType ? (
              <p id="contact-enquiry-type-error" className={ERROR_CLASS}>
                {errors.enquiryType}
              </p>
            ) : null}
          </label>

          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Budget (optional)
            </span>
            <input
              type="text"
              name="budget"
              value={values.budget}
              onChange={(event) => updateValue('budget', event.target.value)}
              placeholder="e.g. up to £500"
              className={FIELD_CLASS}
              aria-invalid={Boolean(errors.budget)}
              aria-describedby={errors.budget ? 'contact-budget-error' : undefined}
            />
            {errors.budget ? (
              <p id="contact-budget-error" className={ERROR_CLASS}>
                {errors.budget}
              </p>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Organisation (optional)
            </span>
            <input
              type="text"
              name="organization"
              value={values.organization}
              onChange={(event) => updateValue('organization', event.target.value)}
              className={FIELD_CLASS}
              aria-invalid={Boolean(errors.organization)}
              aria-describedby={errors.organization ? 'contact-organization-error' : undefined}
            />
            {errors.organization ? (
              <p id="contact-organization-error" className={ERROR_CLASS}>
                {errors.organization}
              </p>
            ) : null}
          </label>

          <label className={FIELD_WRAPPER_CLASS}>
            <span className={FIELD_LABEL_CLASS}>
              Phone (optional)
            </span>
            <input
              type="text"
              name="phone"
              value={values.phone}
              onChange={(event) => updateValue('phone', event.target.value)}
              className={FIELD_CLASS}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            />
            {errors.phone ? (
              <p id="contact-phone-error" className={ERROR_CLASS}>
                {errors.phone}
              </p>
            ) : null}
          </label>
        </div>

        <label className={FIELD_WRAPPER_CLASS}>
          <span className={FIELD_LABEL_CLASS}>
            Subject (optional)
          </span>
          <input
            type="text"
            name="subject"
            value={values.subject}
            onChange={(event) => updateValue('subject', event.target.value)}
            className={FIELD_CLASS}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          />
          {errors.subject ? (
            <p id="contact-subject-error" className={ERROR_CLASS}>
              {errors.subject}
            </p>
          ) : null}
        </label>

        <label className={FIELD_WRAPPER_CLASS}>
          <span className={FIELD_LABEL_CLASS}>
            Message <span aria-hidden className="text-slate-500">*</span>
          </span>
          <textarea
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => updateValue('message', event.target.value)}
            placeholder="Tell us what you would like to support, collect or commission."
            className={FIELD_CLASS}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            required
          />
          {errors.message ? (
            <p id="contact-message-error" className={ERROR_CLASS}>
              {errors.message}
            </p>
          ) : null}
        </label>

        <fieldset>
          <legend className={FIELD_LABEL_CLASS}>
            Interested in
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUPPORT_INTEREST_OPTIONS.map((option) => {
              const checked = selectedInterestSet.has(option)
              return (
                <label
                  key={option}
                  className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
                    checked
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    name="interests"
                    value={option}
                    checked={checked}
                    onChange={() => toggleInterest(option)}
                  />
                  {option}
                </label>
              )
            })}
          </div>
          {errors.interests ? <p className="mt-2 text-sm text-rose-700">{errors.interests}</p> : null}
        </fieldset>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website-field">Website</label>
          <input
            id="website-field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.honeypot}
            onChange={(event) => updateValue('honeypot', event.target.value)}
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-heading inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/45 border-t-white" />
                Sending...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
