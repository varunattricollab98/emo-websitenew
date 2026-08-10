import { FileText } from 'lucide-react'
import Reveal from './Reveal'
import ArticleBlocks from './ArticleBlocks'

/**
 * Full-width blog / long-form article section.
 *
 * Designed to sit between the "Verified Addresses" (or similar trust section)
 * and the FAQ section on city, space, coworking, and service pages.
 *
 * The heading lives inside the article card only. There used to be a second,
 * larger SectionHeading above the card repeating the same title, which read as
 * a duplicate on every page, so it was removed.
 *
 * Props:
 *   title   , heading shown in the card header (required)
 *   eyebrow , small label above the heading (default: "Guide")
 *   blocks  , content array for ArticleBlocks (see ArticleBlocks.jsx for format)
 *   lead    , style first paragraph as editorial lead (default: true)
 *   bg      , background class (default: 'bg-white')
 *
 * Content format (blocks array):
 *   - "string"            → paragraph
 *   - { h: "text" }       → h2 subheading
 *   - { sub: "text" }     → h3 subheading
 *   - { p: "text" }       → paragraph
 *   - { list: [...] }     → checkmark list
 *   - { bullets: [...] }  → bullet list
 *   - { quote: "text" }   → highlighted quote
 */
export default function BlogArticleSection({
  title,
  eyebrow = 'Guide',
  blocks = [],
  lead = true,
  bg = 'bg-white',
}) {
  // Don't render if no content blocks provided
  if (!blocks || blocks.length === 0) return null

  return (
    <section className={`section-padding ${bg}`}>
      <div className="container-custom">
        <Reveal className="mx-auto max-w-4xl">
          <article className="relative overflow-hidden rounded-3xl border border-primary-100/70 bg-white p-7 shadow-card sm:p-10">
            {/* top accent bar */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-400 to-gold" />

            {/* article icon + label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {eyebrow}
                </p>
                <h3 className="text-lg font-bold leading-tight text-navy-dark">
                  {title}
                </h3>
              </div>
            </div>

            {/* article content */}
            <ArticleBlocks blocks={blocks} lead={lead} />
          </article>
        </Reveal>
      </div>
    </section>
  )
}
