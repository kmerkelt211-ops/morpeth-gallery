// sanity/schemaTypes/index.ts
// Keep this list minimal: one schema per site page, plus collections.

import aboutPage from '../schemas/aboutPage'
import alumniPage from '../schemas/alumniPage'
import clubsPage from '../schemas/clubsPage'
import galleryExhibition from '../schemas/galleryExhibition'
import homePage from '../schemas/homePage'
import housePage from '../schemas/housePage'
import product from '../schemas/product'
import shopPage from '../schemas/shopPage'
import staffPage from '../schemas/staffPage'
import studentPage from '../schemas/studentPage'
import supportPage from '../schemas/supportPage'

export const schemaTypes = [
  homePage,
  studentPage,
  staffPage,
  alumniPage,
  housePage,
  clubsPage,
  aboutPage,
  supportPage,
  shopPage,
  product,
  galleryExhibition,
]
