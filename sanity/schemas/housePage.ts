import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'housePage',
  title: 'The House page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'The House',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      initialValue: 'THE HOUSE',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Photography projects with The House',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      initialValue:
        'The House is Morpeth School\'s in-school alternative provision - a specialist, pupil-centred learning hub for a small group of students admitted throughout the year for a range of individual needs. As part of a two-week timetable cycle, students take part in photography workshops designed to build creativity, confidence and artistic skills.',
    }),
    defineField({
      name: 'heroBandColor',
      title: 'Hero band color (hex)',
      type: 'string',
      initialValue: '#C9A66B',
    }),
    defineField({
      name: 'heroImageOverride',
      title: 'Hero image override',
      type: 'object',
      description:
        'Optional fixed hero image for the top of The House page. If set, this is used instead of random images.',
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
            title: title || 'The House hero override image',
          }
        },
      },
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About section title',
      type: 'string',
      initialValue: 'About The House',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About section body',
      description: 'Use a blank line to start a new paragraph.',
      type: 'text',
      rows: 6,
      initialValue:
        'Recognised for our inclusive, community-centred ethos, Morpeth School offers a dedicated in-school alternative provision known as "The House." This specialist programme serves as a central learning hub for a small, carefully selected group of students who are admitted at various points throughout the year for a range of individual needs.\n\nThe House is staffed by a committed team focused on delivering pupil-centred, inclusive education. As part of a two-week timetable cycle, students take part in photography workshops designed to develop their creativity, confidence and artistic skills. The projects shown here are the work produced during those sessions.',
    }),
  ],
})
