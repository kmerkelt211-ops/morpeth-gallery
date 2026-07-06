// Super-simple Studio navigation:
// - One fixed document per site page (singleton docs)
// - A normal list for Gallery Exhibitions

import type { StructureResolver } from 'sanity/desk'
import { ARCHIVED_FILTER, COMING_SOON_FILTER, CURRENT_FILTER } from './lib/exhibition-status'

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
        .title('Alumni page')
        .child(S.document().schemaType('alumniPage').documentId('page_alumni')),

      S.listItem()
        .title('The House page')
        .child(S.document().schemaType('housePage').documentId('page_house')),

      S.listItem()
        .title('Clubs page')
        .child(S.document().schemaType('clubsPage').documentId('page_clubs')),

      S.listItem()
        .title('About page')
        .child(S.document().schemaType('aboutPage').documentId('page_about')),

      S.listItem()
        .title('Support the gallery')
        .child(S.document().schemaType('supportPage').documentId('page_support')),

      S.listItem()
        .title('Shop page')
        .child(S.document().schemaType('shopPage').documentId('page_shop')),

      S.divider(),

      S.listItem()
        .title('Gallery Exhibitions')
        .child(
          S.list()
            .title('Gallery Exhibitions')
            .items([
              S.listItem()
                .title('All exhibitions')
                .child(S.documentTypeList('galleryExhibition').title('All exhibitions')),

              S.divider(),

              S.listItem()
                .title('Current')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Current')
                    .filter(`_type == "galleryExhibition" && (${CURRENT_FILTER})`)
                ),

              S.listItem()
                .title('Coming soon')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Coming soon')
                    .filter(`_type == "galleryExhibition" && (${COMING_SOON_FILTER})`)
                ),

              S.listItem()
                .title('Past / archived')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Past / archived')
                    .filter(`_type == "galleryExhibition" && (${ARCHIVED_FILTER})`)
                ),

              S.divider(),

              S.listItem()
                .title('Alumni')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Alumni')
                    .filter('_type == "galleryExhibition" && exhibitorType == "alumni"')
                ),

              S.listItem()
                .title('Student work')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Student work')
                    .filter('_type == "galleryExhibition" && exhibitorType == "student"')
                ),

              S.listItem()
                .title('Guest artists')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Guest artists')
                    .filter('_type == "galleryExhibition" && exhibitorType == "staffVisiting"')
                ),

              S.listItem()
                .title('The House')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('The House')
                    .filter('_type == "galleryExhibition" && exhibitorType == "house"')
                ),

              S.listItem()
                .title('Collaborative / other')
                .child(
                  S.documentTypeList('galleryExhibition')
                    .title('Collaborative / other')
                    .filter('_type == "galleryExhibition" && exhibitorType == "other"')
                ),
            ])
        ),

      S.listItem()
        .title('Shop products')
        .child(S.documentTypeList('product').title('Shop products')),
    ])
