import { Check } from 'lucide-react'

/**
 * Renders inline Markdown emphasis and links inside a plain string.
 * Supports:
 *   - **bold text**           → <strong>
 *   - [link text](url)       → <a href="url">
 *   - ~~strikethrough~~      → <s>
 *   - `inline code`          → <code>
 */
function inline(text) {
  if (typeof text !== 'string') return text

  // Combined regex: links, bold, strikethrough, inline code
  const pattern = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(~~([^~]+)~~)|(`([^`]+)`)/g

  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // Link: [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition hover:decoration-primary"
          target={match[3].startsWith('http') ? '_blank' : undefined}
          rel={match[3].startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {match[2]}
        </a>
      )
    } else if (match[4]) {
      // Bold: **text**
      parts.push(
        <strong key={match.index} className="font-bold text-navy-dark">
          {match[5]}
        </strong>
      )
    } else if (match[6]) {
      // Strikethrough: ~~text~~
      parts.push(<s key={match.index}>{match[7]}</s>)
    } else if (match[8]) {
      // Inline code: `text`
      parts.push(
        <code key={match.index} className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-navy-dark">
          {match[9]}
        </code>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  // If no matches found, return original text
  return parts.length > 0 ? parts : text
}

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
              {inline(b)}
            </p>
          )
        }
        if (b.h) {
          const headingId = b.h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          return (
            <h2
              key={i}
              id={headingId}
              className="flex items-center gap-3 pt-4 text-2xl font-extrabold tracking-tight text-navy-dark scroll-mt-24"
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
                  <span className="leading-relaxed">{inline(item)}</span>
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
                  {inline(item)}
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
              {inline(b.quote)}
            </blockquote>
          )
        }
        if (b.table) {
          const { headers = [], rows = [] } = b.table
          return (
            // Tables are the one block that can exceed the prose width on
            // mobile, so it scrolls horizontally instead of squashing cells.
            <div key={i} className="my-2 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                {headers.length > 0 && (
                  <thead>
                    <tr className="bg-surface-light">
                      {headers.map((th, hi) => (
                        <th
                          key={hi}
                          className="border-b border-slate-200 px-4 py-3 font-bold text-navy-dark"
                        >
                          {inline(th)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 ? 'bg-surface-light/40' : 'bg-white'}>
                      {row.map((td, ci) => (
                        <td
                          key={ci}
                          className={`border-b border-slate-100 px-4 py-3 align-top ${
                            ci === 0 ? 'font-semibold text-navy-dark' : 'text-slate-600'
                          }`}
                        >
                          {inline(td)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            {inline(b.p || '')}
          </p>
        )
      })}
    </div>
  )
}
