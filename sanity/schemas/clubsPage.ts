import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clubsPage',
  title: 'Clubs page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero' },
    { name: 'clubs', title: "2. What's running" },
    { name: 'faq', title: '3. FAQ' },
    { name: 'meta', title: '4. Metadata' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (r) => r.required(),
      initialValue: 'Clubs • Art + Photography',
      group: 'hero',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      initialValue: 'CLUBS & STUDIOS',
      group: 'hero',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Lunchtime & After-School Art + Photography',
      group: 'hero',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Left-side hero image shown beside the yellow panel.',
      group: 'hero',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroPanelColor',
      title: 'Hero panel colour',
      type: 'string',
      initialValue: '#f1df23',
      description: 'Hex colour, e.g. #f1df23',
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true
          return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value)
            ? true
            : 'Use a valid hex colour (e.g. #f1df23).'
        }),
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'View clubs',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaHref',
      title: 'Primary CTA link',
      type: 'string',
      initialValue: '#whats-running',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
      initialValue: 'Club FAQ',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaHref',
      title: 'Secondary CTA link',
      type: 'string',
      initialValue: '#faq',
      group: 'hero',
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Beginners welcome', 'Portfolio support', 'Exhibit your work'],
      group: 'hero',
    }),
    defineField({
      name: 'note',
      title: 'Small note under badges',
      type: 'string',
      initialValue: 'Free clubs • Drop-in welcome — some sessions require sign-up (capacity).',
      group: 'hero',
    }),
    defineField({
      name: 'clubsSectionTitle',
      title: 'Section title',
      type: 'string',
      initialValue: "WHAT'S RUNNING",
      group: 'clubs',
    }),
    defineField({
      name: 'clubs',
      title: 'Clubs (add multiple)',
      type: 'array',
      group: 'clubs',
      description: 'Add one item per club. These are shown on the Clubs page.',
      validation: (r) => r.min(1),
      of: [
        defineField({
          name: 'club',
          title: 'Club',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'strand',
              title: 'Club type',
              type: 'string',
              description:
                'Any type is fine (e.g. Art, Photography, Art + Photography, Mixed media, Digital, Ceramics).',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'format',
              title: 'Format',
              type: 'string',
              options: {
                list: [
                  { title: 'Lunchtime', value: 'Lunchtime' },
                  { title: 'After school', value: 'After school' },
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'location',
              title: 'Location',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster panel',
              type: 'object',
              description: 'Text shown on the club poster block.',
              fields: [
                defineField({
                  name: 'kicker',
                  title: 'Poster kicker',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'headline',
                  title: 'Poster headline',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'subline',
                  title: 'Poster subline',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
              ],
            }),
            defineField({
              name: 'posterImage',
              title: 'Poster image (optional)',
              type: 'image',
              options: { hotspot: true },
              description:
                'Upload a poster image for this club. If empty, the text poster panel is shown.',
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              rows: 3,
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'whatYoullDo',
              title: "You'll do",
              type: 'array',
              of: [{ type: 'string' }],
              validation: (r) => r.required().min(2),
            }),
            defineField({
              name: 'goodFor',
              title: 'Good for',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: 'kit',
              title: 'Kit',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: 'signup',
              title: 'Signup style',
              type: 'string',
              options: {
                list: [
                  { title: 'Drop-in', value: 'Drop-in' },
                  { title: 'Sign-up', value: 'Sign-up' },
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Card CTA label',
              type: 'string',
              initialValue: 'More info',
            }),
            defineField({
              name: 'accent',
              title: 'Accent colour (optional)',
              type: 'string',
              description: 'Optional hex colour for future use.',
              validation: (r) =>
                r.custom((value) => {
                  if (!value) return true
                  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value)
                    ? true
                    : 'Use a valid hex colour (e.g. #E7F0FF).'
                }),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'day',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'faqTitle',
      title: 'FAQ title',
      type: 'string',
      initialValue: 'FAQ',
      group: 'faq',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ items',
      type: 'array',
      group: 'faq',
      of: [
        defineField({
          name: 'faqItem',
          title: 'FAQ item',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'backLinkLabel',
      title: 'Back link label',
      type: 'string',
      initialValue: '← Back to exhibitions',
      group: 'meta',
    }),
    defineField({
      name: 'backLinkHref',
      title: 'Back link href',
      type: 'string',
      initialValue: '/exhibitions',
      group: 'meta',
    }),
  ],
})
