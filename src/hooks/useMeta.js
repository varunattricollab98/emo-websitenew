import { useEffect } from 'react'

const SITE = 'https://v3.easemyoffice.in'

/**
 * Keeps <title>, meta description, canonical and the Open Graph / Twitter tags
 * in sync as the user navigates the SPA.
 *
 * NOTE ON SOCIAL SHARING: social crawlers (Facebook, WhatsApp, LinkedIn, X)
 * do not run JavaScript, so they never see what this hook sets. The tags that
 * actually drive link previews are baked into the static HTML at build time by
 * scripts/prerender.mjs. This hook exists so the browser tab, bookmarks and
 * history show the right title, and so JS-aware tools read correct values.
 *
 * @param {Object}  meta
 * @param {string}  meta.title        full page title
 * @param {string} [meta.description] meta description
 * @param {string} [meta.path]        route path, e.g. '/virtual-office/haryana/gurgaon'
 * @param {string} [meta.image]       absolute or root-relative image URL
 */
export function useMeta({ title, description, path, image } = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    if (title) document.title = title

    const url = path ? `${SITE}${path}` : window.location.href
    const absImage = image
      ? /^https?:\/\//.test(image)
        ? image
        : SITE + image
      : null

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', absImage)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', absImage)
    setCanonical(url)
  }, [title, description, path, image])
}

function setMeta(attr, key, value) {
  if (!value) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(url) {
  if (!url) return
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}
