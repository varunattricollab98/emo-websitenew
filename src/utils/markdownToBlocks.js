/**
 * Converts simple Markdown text into ArticleBlocks format.
 *
 * This allows blog content to be written in plain Markdown in Supabase
 * instead of complex JSON arrays, much easier to write and edit!
 *
 * Supported Markdown:
 *   # Heading        → { h: "Heading" }         (H2)
 *   ## Subheading    → { sub: "Subheading" }     (H3)
 *   ### Subheading   → { sub: "Subheading" }     (H3)
 *   Normal text      → "paragraph"               (paragraph)
 *   * item           → { bullets: [...] }        (bullet list)
 *   - item           → { bullets: [...] }        (bullet list)
 *   > quote text     → { quote: "text" }         (quote block)
 *   ---              → (ignored, section divider)
 *   **bold text**    → preserved as-is (rendered in JSX if needed)
 *
 * Usage in Supabase:
 *   - Set content_format = 'markdown' in the blog_articles row
 *   - Write the content field as a plain text string (not JSON array)
 *
 * Example Supabase content (as text):
 *   "# Why Virtual Office?\n\nA virtual office provides...\n\n* GST ready\n* Mail handling\n\n> Best decision ever!"
 */
export function markdownToBlocks(markdown) {
  if (!markdown || typeof markdown !== 'string') return []

  const lines = markdown.split('\n')
  const blocks = []
  let currentBullets = []
  let currentParagraph = ''

  function flushParagraph() {
    if (currentParagraph.trim()) {
      blocks.push(currentParagraph.trim())
      currentParagraph = ''
    }
  }

  function flushBullets() {
    if (currentBullets.length) {
      blocks.push({ bullets: [...currentBullets] })
      currentBullets = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Empty line, flush current paragraph
    if (!trimmed) {
      flushBullets()
      flushParagraph()
      continue
    }

    // Horizontal rule (section divider), skip
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      flushBullets()
      flushParagraph()
      continue
    }

    // H2 heading: # Heading
    if (/^#{1}\s+(.+)$/.test(trimmed)) {
      flushBullets()
      flushParagraph()
      const match = trimmed.match(/^#{1}\s+(.+)$/)
      blocks.push({ h: match[1].trim() })
      continue
    }

    // H3 subheading: ## or ### Subheading
    if (/^#{2,3}\s+(.+)$/.test(trimmed)) {
      flushBullets()
      flushParagraph()
      const match = trimmed.match(/^#{2,3}\s+(.+)$/)
      blocks.push({ sub: match[1].trim() })
      continue
    }

    // Quote: > text
    if (/^>\s*(.+)$/.test(trimmed)) {
      flushBullets()
      flushParagraph()
      const match = trimmed.match(/^>\s*(.+)$/)
      // Collect multi-line quotes
      let quoteText = match[1].trim()
      while (i + 1 < lines.length && /^>\s*(.+)$/.test(lines[i + 1].trim())) {
        i++
        quoteText += ' ' + lines[i].trim().replace(/^>\s*/, '')
      }
      blocks.push({ quote: quoteText })
      continue
    }

    // Bullet list: * item or - item
    if (/^[\*\-]\s+(.+)$/.test(trimmed)) {
      flushParagraph()
      const match = trimmed.match(/^[\*\-]\s+(.+)$/)
      currentBullets.push(match[1].trim())
      continue
    }

    // Table rows (skip, too complex for simple rendering)
    if (/^\|/.test(trimmed)) {
      continue
    }

    // Regular text, accumulate into paragraph
    // If previous line was also text (no blank line between), join them
    if (currentBullets.length) {
      flushBullets()
    }
    if (currentParagraph) {
      currentParagraph += ' ' + trimmed
    } else {
      currentParagraph = trimmed
    }
  }

  // Flush remaining
  flushBullets()
  flushParagraph()

  return blocks
}
