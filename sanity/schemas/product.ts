import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Shop product',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'artist', title: 'Artist', type: 'string', initialValue: 'Portman Gallery' }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.min(1000).max(2100),
    }),
    defineField({
      name: 'priceLabel',
      title: 'Price label',
      type: 'string',
      description: 'Shown on the card, e.g. "From £45". Edit any time prices change.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availability',
      title: 'Availability note',
      type: 'string',
      description: 'e.g. "Open edition print" or "Limited run - 3 left".',
      initialValue: 'Open edition print',
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      description: 'Turn off to show "Sold out" and disable buying.',
      initialValue: true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on shop hero',
      type: 'boolean',
      description:
        'Pin this print as the "Featured print" banner instead of letting it rotate randomly. If more than one product has this on, the first one found is used.',
      initialValue: false,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Buy print',
    }),
    defineField({
      name: 'purchaseUrl',
      title: 'Purchase link',
      type: 'url',
      description:
        'Paste a payment link from whichever provider you use (Stripe Payment Link, PayPal, etc). Changing providers later just means pasting a new link here - no code changes needed.',
    }),
    defineField({
      name: 'linkedExhibition',
      title: 'Linked gallery exhibition',
      type: 'reference',
      to: [{ type: 'galleryExhibition' }],
      description: 'Optional alternative to a purchase link.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'priceLabel',
      media: 'image',
    },
  },
})
