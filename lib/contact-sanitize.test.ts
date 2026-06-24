import { describe, expect, it } from 'vitest'
import { cleanEnquiryType, cleanInlineText, cleanInterests, cleanMessage, normalizeBody } from './contact-sanitize'

describe('cleanInlineText', () => {
  it('trims and collapses whitespace', () => {
    expect(cleanInlineText('  hello   world  ', 100)).toBe('hello world')
  })

  it('strips control characters', () => {
    expect(cleanInlineText('hi\x00there\x7f', 100)).toBe('hithere')
  })

  it('truncates to maxLength', () => {
    expect(cleanInlineText('abcdef', 3)).toBe('abc')
  })

  it('returns empty string for non-string input', () => {
    expect(cleanInlineText(undefined, 10)).toBe('')
    expect(cleanInlineText(42, 10)).toBe('')
    expect(cleanInlineText(null, 10)).toBe('')
  })
})

describe('cleanMessage', () => {
  it('normalizes CRLF to LF', () => {
    expect(cleanMessage('line one\r\nline two', 1000)).toBe('line one\nline two')
  })

  it('collapses 3+ newlines down to a blank line', () => {
    expect(cleanMessage('a\n\n\n\nb', 1000)).toBe('a\n\nb')
  })

  it('preserves single newlines, unlike cleanInlineText', () => {
    expect(cleanMessage('line one\nline two', 1000)).toBe('line one\nline two')
  })

  it('truncates to maxLength', () => {
    expect(cleanMessage('a'.repeat(20), 5)).toBe('aaaaa')
  })
})

describe('cleanInterests', () => {
  it('keeps only known options', () => {
    expect(cleanInterests(['Donations', 'Not a real option', 'Exhibiting'])).toEqual([
      'Donations',
      'Exhibiting',
    ])
  })

  it('dedupes repeated options', () => {
    expect(cleanInterests(['Donations', 'Donations'])).toEqual(['Donations'])
  })

  it('returns empty array for non-array input', () => {
    expect(cleanInterests('Donations')).toEqual([])
    expect(cleanInterests(undefined)).toEqual([])
  })
})

describe('cleanEnquiryType', () => {
  it('accepts a known enquiry type', () => {
    expect(cleanEnquiryType('Donation')).toBe('Donation')
  })

  it('rejects an unknown enquiry type', () => {
    expect(cleanEnquiryType('Made up type')).toBeUndefined()
  })

  it('rejects non-string input', () => {
    expect(cleanEnquiryType(123)).toBeUndefined()
  })
})

describe('normalizeBody', () => {
  it('produces a fully sanitized record from a well-formed body', () => {
    const result = normalizeBody({
      name: '  Jane Doe  ',
      email: 'jane@example.com',
      enquiryType: 'Donation',
      message: 'Hello\r\nthere',
      interests: ['Donations', 'bogus'],
      honeypot: '',
    })

    expect(result).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      enquiryType: 'Donation',
      organization: '',
      phone: '',
      budget: '',
      subject: '',
      message: 'Hello\nthere',
      interests: ['Donations'],
      honeypot: '',
    })
  })

  it('does not throw on a non-object body', () => {
    expect(() => normalizeBody(null)).not.toThrow()
    expect(() => normalizeBody('garbage')).not.toThrow()
    expect(() => normalizeBody(42)).not.toThrow()
  })

  it('treats a non-empty honeypot as a signal rather than dropping it silently', () => {
    const result = normalizeBody({ honeypot: 'bot filled this in' })
    expect(result.honeypot).toBe('bot filled this in')
  })
})
