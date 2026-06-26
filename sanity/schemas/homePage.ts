import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Exhibitions home page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Exhibitions home',
    }),
    defineField({
      name: 'heroKicker',
      title: 'Hero kicker',
      type: 'string',
      initialValue: 'PORTMAN GALLERY',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      initialValue: 'EXHIBITIONS',
    }),
    defineField({
      name: 'heroSummary',
      title: 'Hero summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImageOverride',
      title: 'Hero image override',
      type: 'object',
      description:
        'Optional fixed hero image for the top of the Exhibitions page. If set, this is used instead of random images.',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
      preview: {
        select: {
          media: 'image',
          title: 'image.alt',
        },
        prepare({ media, title }) {
          return {
            media,
            title: title || 'Exhibitions hero override image',
          }
        },
      },
    }),
    defineField({
      name: 'currentStripLabel',
      title: 'Current strip label',
      type: 'string',
      initialValue: 'CURRENT Digital-only EXHIBITIONS',
    }),
    defineField({
      name: 'currentStripHelp',
      title: 'Current strip helper text',
      type: 'string',
      initialValue: 'Online only • Visit the exhibition details for links and media',
    }),
    defineField({
      name: 'whatsOnIntro',
      title: 'What’s on intro',
      type: 'text',
      rows: 4,
    }),
  ],
})
