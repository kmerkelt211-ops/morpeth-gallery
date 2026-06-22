'use client'

import { useEffect } from 'react'

export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const id = hash.slice(1)

    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      attempts += 1
      if (attempts < 20) {
        window.setTimeout(tryScroll, 100)
      }
    }

    tryScroll()
  }, [])

  return null
}
