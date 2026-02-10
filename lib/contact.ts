export const SUPPORT_INTEREST_OPTIONS = [
  'Print purchases',
  'Donations',
  'Partnerships',
  'Exhibiting',
  'Volunteering',
  'Other',
] as const

export const SUPPORT_ENQUIRY_OPTIONS = [
  'Print purchase',
  'Donation',
  'Partnership',
  'Exhibiting',
  'Volunteering',
  'General enquiry',
] as const

export type SupportInterestOption = (typeof SUPPORT_INTEREST_OPTIONS)[number]
export type SupportEnquiryOption = (typeof SUPPORT_ENQUIRY_OPTIONS)[number]

export type ContactFormErrors = Partial<
  Record<
    | 'name'
    | 'email'
    | 'enquiryType'
    | 'organization'
    | 'phone'
    | 'budget'
    | 'subject'
    | 'message'
    | 'interests'
    | 'form',
    string
  >
>
