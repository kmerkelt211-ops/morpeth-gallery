import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopPage',
  title: 'Shop page',
  type: 'document',
  initialValue: {
    kicker: 'SHOP',
    headline: 'Collect work from the Portman Gallery programme',
    intro:
      'Explore limited runs and open editions connected to current and recent exhibitions. Every purchase feeds directly back into the gallery programme.',
    featuredKicker: 'Featured print',
    note: 'Prices and availability are kept up to date here. Get in touch if you have any questions before buying.',
    collectionNote:
      'This item is for school collection only - no postage. Please enter your child\'s name and form group at checkout so we can prepare it for collection.',
  },
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({ name: 'featuredKicker', title: 'Featured print kicker', type: 'string' }),
    defineField({
      name: 'collectionNote',
      title: 'Collection note (shown next to Buy buttons)',
      type: 'text',
      description:
        'Shown above the print grid to tell parents how collection works (e.g. no postage, enter student name/form at checkout). Leave blank to hide it.',
    }),
    defineField({ name: 'note', title: 'Note (shown under the grid)', type: 'text' }),
  ],
})
