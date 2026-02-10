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
  ],
})
