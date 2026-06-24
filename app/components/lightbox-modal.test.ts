import { describe, expect, it } from 'vitest'
import { thumbnailUrl } from './lightbox-modal'

describe('thumbnailUrl', () => {
  it('strips an existing query string and appends thumbnail params', () => {
    expect(thumbnailUrl('https://cdn.sanity.io/a.jpg?w=1600&auto=format&q=82')).toBe(
      'https://cdn.sanity.io/a.jpg?w=112&h=112&fit=crop&auto=format'
    )
  })

  it('appends thumbnail params when there is no existing query string', () => {
    expect(thumbnailUrl('https://cdn.sanity.io/a.jpg')).toBe(
      'https://cdn.sanity.io/a.jpg?w=112&h=112&fit=crop&auto=format'
    )
  })
})
