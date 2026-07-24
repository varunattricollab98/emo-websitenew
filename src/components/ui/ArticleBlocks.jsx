import { Check } from 'lucide-react'

/**
 * Renders long-form / blog content from a flexible blocks array.
 * Each block can be:
 *   - a plain string            -> paragraph
 *   - { h: 'text' }             -> section subheading (h2)
 *   - { sub: 'text' }           -> smaller subheading (h3)
 *   - { p: 'text' }             -> paragraph
 *   - { list: ['a','b'] }       -> checkmark list
 *   - { bullets: ['a','b'] }    -> plain bullet list
 *   - { quote: 'text' }         -> highlighted quote
 *
 * This means any amount of blog content can be added later and it just renders.
 *
 * `lead` (bool): styles the first paragraph as a larger intro/lead paragraph
 * for a more editorial, readable feel.
 */
const PARA = 'text-[15.5px] leading-[1.9] text-slate-600'

export default function ArticleBlocks({ blocks = [], lead = false }) {
  // index of the first paragraph-like block (for optional lead styling)
  const firstParaIdx = blocks.findIndex(
    (b) => typeof b === 'string' || (b && typeof b === 'object' && b.p)
  )

  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        const isLead = lead && i === firstParaIdx
        if (typeof b === 'string') {
          return (
            <p
              key={i}
              className={
                isLead
                  ? 'text-lg leading-[1.85] text-navy/90 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-extrabold first-letter:leading-none first-letter:text-primary'
                  : PARA
              }
            >
              {b}
            </p>
          )
        }
        if (b.h) {
          return (
            <h2
              key={i}
              className="flex items-center gap-3 pt-4 text-2xl font-extrabold tracking-tight text-navy-dark"
            >
              <span className="inline-block h-6 w-1.5 flex-none rounded-full bg-gradient-to-b from-gold to-gold-dark" />
              {b.h}
            </h2>
          )
        }
        if (b.sub) {
          return (
            <h3 key={i} className="pt-2 text-lg font-bold text-navy-dark">
              {b.sub}
            </h3>
          )
        }
        if (b.list) {
          return (
            <ul key={i} className="space-y-2.5">
              {b.list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (b.bullets) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5 text-slate-600">
              {b.bullets.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )
        }
        if (b.quote) {
          return (
            <blockquote
              key={i}
              className="rounded-2xl border-l-4 border-gold bg-surface-light px-5 py-4 text-navy-dark"
            >
              {b.quote}
            </blockquote>
          )
        }
        return (
          <p
            key={i}
            className={
              lead && i === firstParaIdx
                ? 'text-lg leading-[1.85] text-navy/90 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-extrabold first-letter:leading-none first-letter:text-primary'
                : PARA
            }
          >
            {b.p || ''}
          </p>
        )
      })}
    </div>
  )
}
