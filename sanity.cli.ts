/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const studioHost =
  process.env.SANITY_STUDIO_HOST ||
  process.env.NEXT_PUBLIC_SANITY_STUDIO_HOST ||
  'morpeth-gallery-y8xxd4ya'

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost,
  deployment: {
    appId: 'upe78xi3y9zke5p2xbkdmhm5',
  },
})
