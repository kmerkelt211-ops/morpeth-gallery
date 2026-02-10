// sanity/schemaTypes/index.ts
// Keep this list minimal: one schema per site page, plus collections.

import aboutPage from '../schemas/aboutPage'
import clubsPage from '../schemas/clubsPage'
import galleryExhibition from '../schemas/galleryExhibition'
import homePage from '../schemas/homePage'
import staffPage from '../schemas/staffPage'
import studentPage from '../schemas/studentPage'
import supportPage from '../schemas/supportPage'

export const schemaTypes = [
  homePage,
  studentPage,
  staffPage,
  clubsPage,
  aboutPage,
  supportPage,
  galleryExhibition,
]
