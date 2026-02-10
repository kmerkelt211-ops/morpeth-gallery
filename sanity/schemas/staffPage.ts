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
  ],
})
