// Status logic for galleryExhibition documents.
//
// Each exhibition's status is normally derived from its dates:
// - no startDate yet           -> "coming soon"
// - endDate already passed     -> "archived" (past)
// - otherwise                  -> "current"
//
// Editors can bypass this with `archiveStatusOverride`, which always wins
// when set to anything other than "auto". Keep these GROQ fragments in sync
// with that field's options (see sanity/schemas/galleryExhibition.ts).

export const ARCHIVED_FILTER =
  'archiveStatusOverride == "archived" || ((!defined(archiveStatusOverride) || archiveStatusOverride == "auto") && defined(endDate) && endDate < now())'

export const COMING_SOON_FILTER =
  'archiveStatusOverride == "comingSoon" || ((!defined(archiveStatusOverride) || archiveStatusOverride == "auto") && !defined(startDate))'

export const CURRENT_FILTER =
  'archiveStatusOverride == "current" || ((!defined(archiveStatusOverride) || archiveStatusOverride == "auto") && defined(startDate) && (!defined(endDate) || endDate >= now()))'
