import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'studentPage',
  title: 'Student page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Student Work',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      initialValue: 'STUDENT WORK',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'From first sketches to final shows',
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
        'Optional fixed hero image for the top of the Student Work page. If set, this is used instead of random images.',
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
            title: title || 'Student work hero override image',
          }
        },
      },
    }),
  ],
})
