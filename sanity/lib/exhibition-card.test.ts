import { describe, expect, it } from 'vitest'
import { pickRandomHeroImage, type ExhibitionCard } from './exhibition-card'

function card(overrides: Partial<ExhibitionCard> = {}): ExhibitionCard {
  return {
    _id: 'id-1',
    title: 'Untitled',
    ...overrides,
  }
}

describe('pickRandomHeroImage', () => {
  it('returns an empty string when there are no images anywhere', () => {
    expect(pickRandomHeroImage([])).toBe('')
    expect(pickRandomHeroImage([card()])).toBe('')
  })

  it('returns the only image when exactly one is available', () => {
    const result = pickRandomHeroImage([card({ heroImageUrls: ['https://cdn.sanity.io/a.jpg'] })])
    expect(result).toBe('https://cdn.sanity.io/a.jpg')
  })

  it('only returns urls that are actually present in the pool', () => {
    const items = [
      card({ heroImageUrls: ['https://cdn.sanity.io/a.jpg'] }),
      card({ galleryImageUrls: ['https://cdn.sanity.io/b.jpg'] }),
    ]
    const pool = ['https://cdn.sanity.io/a.jpg', 'https://cdn.sanity.io/b.jpg']
    for (let i = 0; i < 20; i += 1) {
      expect(pool).toContain(pickRandomHeroImage(items))
    }
  })

  it('deduplicates the same url appearing in both hero and gallery images', () => {
    const items = [
      card({
        heroImageUrls: ['https://cdn.sanity.io/a.jpg'],
        galleryImageUrls: ['https://cdn.sanity.io/a.jpg'],
      }),
    ]
    expect(pickRandomHeroImage(items)).toBe('https://cdn.sanity.io/a.jpg')
  })
})
