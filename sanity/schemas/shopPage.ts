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
  },
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({ name: 'featuredKicker', title: 'Featured print kicker', type: 'string' }),
    defineField({ name: 'note', title: 'Note (shown under the grid)', type: 'text' }),
  ],
})
