import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (r) => r.required(),
      initialValue: 'About Morpeth Gallery',
      description: 'Main page title used for About page content.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
      description: 'Top introductory paragraph under ABOUT THE SPACE.',
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
      initialValue: 'A WORLD OF STUDENT ART',
    }),
    defineField({
      name: 'heroSummary',
      title: 'Hero summary',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'heroBandColor',
      title: 'Hero band color (hex)',
      type: 'string',
      initialValue: '#88B4A8',
    }),

    defineField({
      name: 'whatsOnTitle',
      title: "What's On section title",
      type: 'string',
      initialValue: "WHAT'S ON AT PORTMAN",
    }),
    defineField({
      name: 'whatsOnSubtitle',
      title: "What's On section subtitle",
      type: 'string',
      initialValue: 'FEATURED',
    }),
    defineField({
      name: 'whatsOnCards',
      title: "What's On cards",
      type: 'array',
      description:
        'Add 3-4 featured cards. Each card can have custom text/image and links to any Gallery Exhibition.',
      validation: (r) => r.max(8),
      of: [
        {
          type: 'object',
          name: 'whatsOnCard',
          fields: [
            defineField({
              name: 'kicker',
              title: 'Kicker',
              type: 'string',
              initialValue: 'PORTMAN GALLERY',
            }),
            defineField({
              name: 'title',
              title: 'Card title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Button label',
              type: 'string',
              initialValue: 'More info',
            }),
            defineField({
              name: 'href',
              title: 'Card link (optional)',
              type: 'string',
              description:
                'Optional custom link like /clubs or /exhibitions. If left empty, the linked exhibition below is used.',
            }),
            defineField({
              name: 'image',
              title: 'Card image',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'exhibition',
              title: 'Linked gallery exhibition',
              type: 'reference',
              to: [{ type: 'galleryExhibition' }],
              description: 'Optional if you set a custom card link above.',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'exhibition.title',
              media: 'image',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'body',
      title: 'Main body content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Optional long-form content for the left column.',
    }),

    defineField({
      name: 'aboutFeatureImage',
      title: 'Feature image under main text',
      type: 'object',
      description: 'Image and caption card shown under the main About text.',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          validation: (r) => r.required(),
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'artist', title: 'Artist', type: 'string' }),
        defineField({
          name: 'year',
          title: 'Year',
          type: 'number',
          validation: (r) => r.min(1000).max(2100),
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),

    defineField({
      name: 'quickFacts',
      title: 'Quick facts',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'quickFact',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      description: 'Two-column list in the right panel.',
    }),

    defineField({
      name: 'pastExhibitions',
      title: 'Past exhibitions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Simple list of past exhibition lines.',
    }),

    defineField({
      name: 'futurePlans',
      title: 'Future / in development',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Simple list of upcoming plans.',
    }),

    defineField({
      name: 'communityLinks',
      title: 'Community links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'communityLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Link label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),

    defineField({
      name: 'gallerySnapshots',
      title: 'Gallery snapshots',
      type: 'array',
      validation: (r) => r.min(1),
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'title', type: 'string', title: 'Picture title' }),
            defineField({ name: 'artist', type: 'string', title: 'Artist' }),
            defineField({
              name: 'year',
              type: 'number',
              title: 'Year',
              validation: (r) => r.min(1000).max(2100),
            }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
      options: { layout: 'grid' },
    }),
  ],
})
