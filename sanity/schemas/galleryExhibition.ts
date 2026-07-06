import { defineType, defineField } from 'sanity'

const reservedSlugs = new Set(['about', 'clubs', 'staff', 'guest-artists', 'student', 'studio', 'alumni', 'support', 'exhibitions', 'house'])

export default defineType({
  name: 'galleryExhibition',
  title: 'Gallery Exhibition',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subtitle', type: 'string' }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: r =>
        r.required().custom((slugValue) => {
          const value = slugValue?.current?.toLowerCase()
          if (!value) return true
          if (reservedSlugs.has(value)) {
            return `Slug "${value}" is reserved for a top-level route`
          }
          return true
        }),
    }),

    defineField({
      name: 'locationType',
      type: 'string',
      options: {
        list: [
          { title: 'Portman Gallery', value: 'portman' },
          { title: 'Around the school', value: 'aroundSchool' },
          { title: 'External gallery', value: 'external' },
          { title: 'Digital-only', value: 'digital' },
        ],
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'viewLayout',
      title: 'Layout type',
      type: 'string',
      options: {
        list: [
          { title: 'Digital gallery', value: 'digitalGallery' },
          { title: "What’s on / event", value: 'whatsOn' },
        ],
        layout: 'radio',
      },
      initialValue: 'digitalGallery',
    }),

    // External venue details (only show when locationType === 'external')
    defineField({
      name: 'venueName',
      title: 'Venue name',
      type: 'string',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueAddress',
      title: 'Venue address',
      type: 'text',
      rows: 2,
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueWebsite',
      title: 'Venue website',
      type: 'url',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueMapLink',
      title: 'Google Maps link',
      type: 'url',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'eventUrl',
      title: 'External event URL',
      type: 'url',
      description: 'Optional link to an external gallery/event page.',
    }),
    defineField({
      name: 'eventUrlLabel',
      title: 'External event URL label',
      type: 'string',
      hidden: ({ document }) => !document?.eventUrl,
      description: 'Optional custom button label for the external event URL.',
    }),

    defineField({
      name: 'exhibitorType',
      title: 'Exhibitor type',
      type: 'string',
      options: {
        list: [
          { title: 'Student work', value: 'student' },
          { title: 'Guest artists', value: 'staffVisiting' },
          { title: 'Alumni', value: 'alumni' },
          { title: 'The House', value: 'house' },
          { title: 'Collaborative / other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'guestArtistCategory',
      title: 'Guest artist category',
      type: 'string',
      hidden: ({ document }) => document?.exhibitorType !== 'staffVisiting',
      options: {
        list: [
          { title: 'Visiting', value: 'visiting' },
          { title: 'Welcoming', value: 'welcoming' },
          { title: 'Projects', value: 'projects' },
        ],
        layout: 'radio',
      },
      description:
        'Only used for Guest Artists. Splits the Guest Artists page into three sections. Leave blank to show under "Visiting".',
    }),

    defineField({
      name: 'isCurrent',
      title: "Show in 'Current digital exhibitions' carousel",
      type: 'boolean',
      initialValue: false,
      description:
        'Only matters when Layout type above is "Digital gallery." Turn on to feature this exhibition in the rotating "Current digital exhibitions" carousel on the home/exhibitions page.',
    }),
    defineField({
      name: 'showInWhatsOn',
      title: "Show in 'What's On' grid",
      type: 'boolean',
      initialValue: true,
      description:
        'Only matters when Layout type above is "What\'s on / event." Controls whether this exhibition appears in the "WHAT\'S ON" grid on the home/exhibitions page. Turn off to manually hide it from that grid even if its dates would otherwise show it there.',
    }),
    defineField({
      name: 'featuredOnAbout',
      title: 'Feature on About page (latest news)',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to show this exhibition as a "latest news" style card in the "WHAT\'S ON AT PORTMAN" section on the About page. Separate from the "What\'s On" grid and carousel above, which live on the home/exhibitions page.',
    }),
    defineField({ name: 'startDate', type: 'date' }),
    defineField({ name: 'endDate', type: 'date' }),

    defineField({
      name: 'archiveStatusOverride',
      title: 'Status override (escape hatch)',
      type: 'string',
      options: {
        list: [
          { title: 'Let dates decide (default)', value: 'auto' },
          { title: 'Force: Coming soon', value: 'comingSoon' },
          { title: 'Force: Current', value: 'current' },
          { title: 'Force: Archived / past', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
      description:
        'Leave this on "Let dates decide" - the site works out the status automatically: no start date yet = Coming soon, end date already passed = Archived, otherwise = Current. Only change this if you need to manually force a status regardless of the dates above. This setting always overrides the automatic date logic.',
    }),

    defineField({
      name: 'bgColor',
      title: 'Bg Color',
      type: 'string',
      description: 'Background band colour for the exhibition header.',
      options: {
        layout: 'dropdown',
        list: [
          { title: 'Aqua (Morpeth)', value: '#9EDFE6' },
          { title: 'Lavender', value: '#B5B9FF' },
          { title: 'Soft Pink', value: '#F3D7E6' },
          { title: 'Warm Sand', value: '#FFF1D6' },
          { title: 'Peach', value: '#FFD7B3' },
          { title: 'Tangerine', value: '#FFC16B' },
          { title: 'Mint', value: '#E6F5ED' },
          { title: 'Pale Blue', value: '#E7F0FF' },
          { title: 'Lilac Grey', value: '#ECE6FF' },
          { title: 'Off White', value: '#F5F5F5' },
          { title: 'Light Grey', value: '#EEEEEE' },
          { title: 'White', value: '#FFFFFF' },
        ],
      },
    }),

    // Keep hero images small (for cards/headers)
    defineField({
      name: 'heroImages',
      title: 'Hero images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: r => r.max(2),
    }),

    // NEW: the actual gallery (lots of images, grid upload)
    defineField({
      name: 'galleryImages',
      title: 'Gallery images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
      options: { layout: 'grid' },
    }),

    // NEW: optional PDF guide / worksheet
    defineField({
      name: 'guidePdf',
      title: 'PDF guide',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),

    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),

    defineField({ name: 'orderRank', type: 'number' }),
  ],

  orderings: [
    {
      title: 'Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
