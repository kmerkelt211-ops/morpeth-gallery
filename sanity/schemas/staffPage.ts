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
      name: 'heroBandColor',
      title: 'Hero band color (hex)',
      type: 'string',
      initialValue: '#d292b0',
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

    defineField({
      name: 'visitingCard',
      title: 'Visiting card',
      description: 'Image and description for the "Visiting" category tile - artists who come to Portman.',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'welcomingCard',
      title: 'Welcoming card',
      description: 'Image and description for the "Welcoming" category tile - students visiting an artist / viewing work / having their own work displayed.',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'projectsCard',
      title: 'Projects card',
      description: 'Image and description for the "Projects" category tile.',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
      ],
    }),
  ],
})
