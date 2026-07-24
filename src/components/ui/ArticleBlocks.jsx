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
 */
export default function ArticleBlocks({ blocks = [] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (typeof b === 'string') {
          return (
            <p key={i} className="leading-relaxed text-slate-600">
              {b}
            </p>
          )
        }
        if (b.h) {
          return (
            <h2 key={i} className="pt-4 text-2xl font-extrabold tracking-tight text-navy-dark">
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
          <p key={i} className="leading-relaxed text-slate-600">
            {b.p || ''}
          </p>
        )
      })}
    </div>
  )
}
