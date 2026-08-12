import { useRef, useCallback } from 'react'

/* ─── Toolbar Button ─── */
function ToolbarBtn({ onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded px-2 py-1 text-xs font-medium transition text-slate-600 hover:bg-slate-200 hover:text-slate-900"
    >
      {children}
    </button>
  )
}

/* ─── Separator ─── */
function Sep() {
  return <div className="mx-1 h-5 w-px bg-slate-300" />
}

/* ─── Main Editor Component ─── */
export default function RichMarkdownEditor({ value, onChange, placeholder }) {
  const textareaRef = useRef(null)

  const insertAtCursor = useCallback((before, after = '', defaultText = '') => {
    const ta = textareaRef.current
    if (!ta) return
    ta.focus()
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = ta.value.substring(start, end)
    const text = selected || defaultText
    const newValue =
      ta.value.substring(0, start) + before + text + after + ta.value.substring(end)
    onChange?.(newValue)
    // Set cursor position after React re-renders
    requestAnimationFrame(() => {
      const cursorPos = start + before.length + text.length + after.length
      ta.selectionStart = cursorPos
      ta.selectionEnd = cursorPos
      ta.focus()
    })
  }, [onChange])

  const wrapSelection = useCallback((before, after, defaultText = '') => {
    const ta = textareaRef.current
    if (!ta) return
    ta.focus()
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = ta.value.substring(start, end)
    const text = selected || defaultText
    const newValue =
      ta.value.substring(0, start) + before + text + after + ta.value.substring(end)
    onChange?.(newValue)
    requestAnimationFrame(() => {
      if (!selected) {
        // Select the default text so user can type over it
        ta.selectionStart = start + before.length
        ta.selectionEnd = start + before.length + text.length
      } else {
        const cursorPos = start + before.length + text.length + after.length
        ta.selectionStart = cursorPos
        ta.selectionEnd = cursorPos
      }
      ta.focus()
    })
  }, [onChange])

  const insertLinePrefix = useCallback((prefix) => {
    const ta = textareaRef.current
    if (!ta) return
    ta.focus()
    const start = ta.selectionStart
    // Find the beginning of the current line
    const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1
    const newValue =
      ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart)
    onChange?.(newValue)
    requestAnimationFrame(() => {
      const cursorPos = start + prefix.length
      ta.selectionStart = cursorPos
      ta.selectionEnd = cursorPos
      ta.focus()
    })
  }, [onChange])

  const handleBold = () => wrapSelection('**', '**', 'bold text')
  const handleH2 = () => insertLinePrefix('## ')
  const handleH3 = () => insertLinePrefix('### ')
  const handleBullet = () => insertLinePrefix('- ')
  const handleQuote = () => insertLinePrefix('> ')
  const handleHR = () => insertAtCursor('\n---\n')

  const handleLink = () => {
    const ta = textareaRef.current
    if (!ta) return
    const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd)
    const url = window.prompt('URL', 'https://')
    if (url === null) return
    const linkText = selected || 'link text'
    wrapSelection('[', `](${url})`, linkText)
  }

  const handleTable = () => {
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n`
    insertAtCursor(tableTemplate)
  }

  return (
    <div className="rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 rounded-t-lg">
        <ToolbarBtn onClick={handleBold} title="Bold (**text**)">
          B
        </ToolbarBtn>

        <Sep />

        <ToolbarBtn onClick={handleH2} title="Heading 2 (## )">
          H2
        </ToolbarBtn>
        <ToolbarBtn onClick={handleH3} title="Heading 3 (### )">
          H3
        </ToolbarBtn>

        <Sep />

        <ToolbarBtn onClick={handleBullet} title="Bullet List (- )">
          &bull; List
        </ToolbarBtn>

        <Sep />

        <ToolbarBtn onClick={handleQuote} title="Blockquote (> )">
          &ldquo; Quote
        </ToolbarBtn>
        <ToolbarBtn onClick={handleTable} title="Insert Table">
          Table
        </ToolbarBtn>
        <ToolbarBtn onClick={handleLink} title="Insert Link">
          Link
        </ToolbarBtn>
        <ToolbarBtn onClick={handleHR} title="Horizontal Rule (---)">
          &#8212;
        </ToolbarBtn>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || 'Start writing your content...'}
        className="w-full min-h-[320px] px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white rounded-b-lg resize-y focus:outline-none font-mono"
      />
    </div>
  )
}
