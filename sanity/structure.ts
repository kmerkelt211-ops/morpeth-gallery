// Super-simple Studio navigation:
// - One fixed document per site page (singleton docs)
// - A normal list for Gallery Exhibitions

import type { StructureResolver } from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Exhibitions home')
        .child(S.document().schemaType('homePage').documentId('page_home')),

      S.listItem()
        .title('Student page')
        .child(S.document().schemaType('studentPage').documentId('page_student')),

      S.listItem()
        .title('Guest artists page')
        .child(S.document().schemaType('staffPage').documentId('page_staff')),

      S.listItem()
        .title('Clubs page')
        .child(S.document().schemaType('clubsPage').documentId('page_clubs')),

      S.listItem()
        .title('About page')
        .child(S.document().schemaType('aboutPage').documentId('page_about')),

      S.listItem()
        .title('Support the gallery')
        .child(S.document().schemaType('supportPage').documentId('page_support')),

      S.divider(),

      S.listItem()
        .title('Gallery Exhibitions')
        .child(S.documentTypeList('galleryExhibition').title('Gallery Exhibitions')),
    ])
