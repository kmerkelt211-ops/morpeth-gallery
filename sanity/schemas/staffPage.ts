import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'staffPage',
  title: 'Guest artists page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Guest Artists',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      initialValue: 'GUEST ARTISTS',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Practising artists in the classroom',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'heroImageOverride',
      title: 'Hero image override',
      type: 'object',
      description:
        'Optional fixed hero image for the top of the Guest Artists page. If set, this is used instead of random images.',
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
            title: title || 'Guest artists hero override image',
          }
        },
      },
    }),
  ],
})
