import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './env'

// Schemas
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'Morpeth Gallery',

  projectId,
  dataset,
  apiVersion,

  // This makes Studio live at /studio when embedded in Next
  basePath: '/studio',

  plugins: [deskTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],

  schema: {
    types: schemaTypes,
  },
})
