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
