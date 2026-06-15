import { useEffect } from 'react'

/**
 * Adds the `in` class to every `.reveal` element as it scrolls into view,
 * triggering the CSS fade / slide-up transition. Runs once per element.
 * This is purely a presentational scroll animation — no interaction logic.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
