import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'alumniPage',
  title: 'Alumni page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero' },
    { name: 'spotlights', title: '2. Alumni spotlights' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'hero',
      initialValue: 'Alumni',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      group: 'hero',
      initialValue: 'ALUMNI',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Where Morpeth artists go next',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'hero',
      initialValue:
        'Former students of the Portman Gallery programme continue to make, exhibit and work in art and photography. This page celebrates their journeys and current practice.',
    }),
    defineField({
      name: 'spotlights',
      title: 'Alumni spotlights',
      description: 'Short profiles of former students - their journey since leaving Morpeth.',
      type: 'array',
      group: 'spotlights',
      validation: (rule) => rule.max(24),
      of: [
        {
          type: 'object',
          name: 'alumniSpotlight',
          fields: [
            defineField({
              name: 'image',
              title: 'Photo or artwork',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'graduationYear',
              title: 'Year left Morpeth',
              type: 'number',
              validation: (rule) => rule.min(1980).max(2100),
            }),
            defineField({
              name: 'currentPursuit',
              title: 'Current pursuit',
              type: 'string',
              description: 'e.g. "Fine Art student, Goldsmiths" or "Freelance photographer"',
            }),
            defineField({
              name: 'quote',
              title: 'Quote or note',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'portfolioUrl',
              title: 'Portfolio / website link',
              type: 'url',
            }),
            defineField({
              name: 'instagramHandle',
              title: 'Instagram handle (optional)',
              type: 'string',
              description: 'Without the @ symbol.',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'currentPursuit',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
})
