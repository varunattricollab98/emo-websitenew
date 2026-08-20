#!/usr/bin/env node
/**
 * Push blog articles from supabase/*-article.sql straight into the
 * `blog_articles` table, without pasting SQL into the Supabase dashboard.
 *
 * The .sql files stay the source of truth. This script just parses them and
 * performs the same delete-then-insert those scripts do, so running it twice
 * is safe and always leaves exactly one row per target.
 *
 * ── Why a service key ───────────────────────────────────────────────────────
 * The anon key that ships in the browser bundle is read-only (RLS allows
 * SELECT only), so it cannot write articles. Writing needs the service_role
 * key, which bypasses RLS.
 *
 * NEVER commit the service key or paste it into chat/issues. Keep it in your
 * shell for one command, or in a local .env that git ignores.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *   # See what is in the DB vs what the repo has (no key needed)
 *   node scripts/push-articles.mjs --status
 *
 *   # Parse and show exactly what would change (no key needed, no writes)
 *   node scripts/push-articles.mjs --all --dry-run
 *
 *   # Push everything
 *   SUPABASE_SERVICE_KEY=xxx node scripts/push-articles.mjs --all
 *
 *   # Push specific articles
 *   SUPABASE_SERVICE_KEY=xxx node scripts/push-articles.mjs supabase/gst-registration-article.sql
 *
 *   # Skip the confirmation prompt (for CI)
 *   SUPABASE_SERVICE_KEY=xxx node scripts/push-articles.mjs --all --yes
 *
 * Flags: --all  --dry-run  --status  --yes  --help
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SQL_DIR = join(ROOT, 'supabase')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://oijtkvkyefqfwuycibcv.supabase.co'
// Read-only key, used for --status and the post-push verification read.
const ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_w7-240CdmLJ_xZy5Fg11Fg__ZI-wPO1'
// Write key. Accepts the new secret key (sb_secret_…) or a legacy service_role JWT.
const SERVICE_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

const args = process.argv.slice(2)
const has = (f) => args.includes(f)
const DRY = has('--dry-run')
const ALL = has('--all')
const STATUS = has('--status')
const YES = has('--yes')
const HELP = has('--help') || has('-h')

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
}

if (HELP) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^#!.*\n/, ''))
  process.exit(0)
}

// ── SQL parsing ─────────────────────────────────────────────────────────────

/** Unescape a Postgres single-quoted literal ('' -> '). */
const unquote = (s) => s.replace(/''/g, "'")

/** Split a VALUES tuple on top-level commas only (ignores commas inside quotes/parens). */
function splitTuple(inner) {
  const out = []
  let cur = ''
  let depth = 0
  let inStr = false
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (inStr) {
      if (ch === "'" && inner[i + 1] === "'") { cur += "''"; i++; continue }
      if (ch === "'") { inStr = false; cur += ch; continue }
      cur += ch
      continue
    }
    if (ch === "'") { inStr = true; cur += ch; continue }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/**
 * Parse one article SQL file into the row(s) it inserts.
 * Relies on the shared template: a $md$-quoted body, article_title /
 * article_subtitle literals, and INSERT INTO blog_articles (cols) VALUES (...).
 */
function parseArticleSql(file) {
  const sql = readFileSync(file, 'utf8')
  const name = basename(file)

  const first = sql.indexOf('$md$')
  const last = sql.lastIndexOf('$md$')
  if (first === -1 || last === first) throw new Error(`${name}: could not find the $md$ ... $md$ body`)
  const md = sql.slice(first + 4, last)
  if (!md.trim()) throw new Error(`${name}: article body is empty`)

  const titleM = sql.match(/article_title\s+text\s*:=\s*'([\s\S]*?)';/)
  const subM = sql.match(/article_subtitle\s+text\s*:=\s*'([\s\S]*?)';/)
  if (!titleM) throw new Error(`${name}: could not find article_title`)

  const vars = {
    md,
    article_title: unquote(titleM[1]),
    article_subtitle: subM ? unquote(subM[1]) : '',
  }

  // Column list from the first INSERT.
  const colsM = sql.match(/INSERT\s+INTO\s+blog_articles\s*\(([\s\S]*?)\)/i)
  if (!colsM) throw new Error(`${name}: could not find INSERT INTO blog_articles (...)`)
  const cols = colsM[1].split(',').map((s) => s.trim())

  // All VALUES tuples from the first VALUES block (both branches insert the
  // same logical rows, so the first is enough).
  const valuesM = sql.match(/VALUES\s*([\s\S]*?);/i)
  if (!valuesM) throw new Error(`${name}: could not find a VALUES block`)
  const tuples = [...valuesM[1].matchAll(/\(([\s\S]*?)\)(?=\s*,\s*\(|\s*$)/g)].map((m) => m[1])
  if (!tuples.length) throw new Error(`${name}: no VALUES tuples parsed`)

  const rows = tuples.map((t) => {
    const parts = splitTuple(t)
    if (parts.length !== cols.length)
      throw new Error(`${name}: ${parts.length} values for ${cols.length} columns`)
    const row = {}
    parts.forEach((raw, i) => {
      const col = cols[i]
      let v
      if (/^null$/i.test(raw)) v = null
      else if (/^'[\s\S]*'$/.test(raw)) v = unquote(raw.slice(1, -1))
      else if (/^-?\d+(\.\d+)?$/.test(raw)) v = Number(raw)
      else if (/^to_jsonb\(\s*md\s*\)$/i.test(raw) || raw === 'md') v = vars.md
      else if (raw in vars) v = vars[raw]
      else if (/^true|false$/i.test(raw)) v = /^true$/i.test(raw)
      else throw new Error(`${name}: unrecognised value \`${raw}\` for column ${col}`)
      row[col] = v
    })
    return row
  })

  // De-duplicate identical rows (the jsonb and text branches).
  const seen = new Set()
  const unique = rows.filter((r) => {
    const k = `${r.page_type}|${r.city_slug}|${r.service_slug ?? ''}|${r.area_slug ?? ''}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return { file, name, rows: unique }
}

const describe = (r) =>
  [
    `page_type=${r.page_type}`,
    r.city_slug ? `city=${r.city_slug}` : 'city=NULL',
    r.service_slug ? `service=${r.service_slug}` : null,
    r.area_slug ? `area=${r.area_slug}` : null,
  ]
    .filter(Boolean)
    .join(' ')

// ── Supabase helpers ────────────────────────────────────────────────────────

async function fetchExisting(key) {
  const url = `${SUPABASE_URL}/rest/v1/blog_articles?select=page_type,city_slug,area_slug,service_slug,title,content&limit=500`
  const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  if (!res.ok) throw new Error(`read failed: HTTP ${res.status} ${await res.text()}`)
  return res.json()
}

/** Match the row's exact target, using IS NULL for absent scoping columns. */
function targetQuery(r) {
  const p = new URLSearchParams()
  p.set('page_type', `eq.${r.page_type}`)
  p.set('city_slug', r.city_slug ? `eq.${r.city_slug}` : 'is.null')
  p.set('service_slug', r.service_slug ? `eq.${r.service_slug}` : 'is.null')
  p.set('area_slug', r.area_slug ? `eq.${r.area_slug}` : 'is.null')
  return p.toString()
}

/**
 * Delete the target row(s) and return them, so a failed insert afterwards can
 * be rolled back. PostgREST has no transactions across requests, so this
 * return value is the only thing standing between a failed push and losing
 * live article content.
 */
async function deleteTarget(r) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?${targetQuery(r)}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'return=representation',
    },
  })
  if (!res.ok) throw new Error(`delete failed: HTTP ${res.status} ${await res.text()}`)
  return res.json()
}

/** Put back rows removed by deleteTarget() when the follow-up insert failed. */
async function restore(rows) {
  if (!rows?.length) return true
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
  })
  return res.ok
}

async function insertRow(r) {
  // Sending content as a JSON string works whether the column is jsonb
  // (stored as a JSON string, same as to_jsonb(md)) or text.
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(r),
  })
  if (!res.ok) throw new Error(`insert failed: HTTP ${res.status} ${await res.text()}`)
}

const ask = (q) =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(q, (a) => { rl.close(); resolve(a.trim().toLowerCase()) })
  })

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const allFiles = readdirSync(SQL_DIR)
    .filter((f) => f.endsWith('-article.sql'))
    .sort()
    .map((f) => join(SQL_DIR, f))

  if (STATUS) {
    console.log(c.bold('\nRepo article scripts vs the blog_articles table\n'))
    const existing = await fetchExisting(ANON_KEY)
    const key = (r) =>
      `${r.page_type}|${r.city_slug || ''}|${r.service_slug || ''}|${r.area_slug || ''}`
    const dbMap = new Map(existing.map((r) => [key(r), r]))

    let missing = 0
    for (const f of allFiles) {
      let parsed
      try { parsed = parseArticleSql(f) } catch (e) { console.log(`  ${c.red('parse error')} ${basename(f)}: ${e.message}`); continue }
      for (const r of parsed.rows) {
        const db = dbMap.get(key(r))
        const inDb = Boolean(db)
        if (!inDb) missing++
        const len = db ? String(db.content ?? '').length : 0
        console.log(
          `  ${inDb ? c.green('in db ') : c.yellow('MISSING')}  ${basename(f).padEnd(36)} ${describe(r)}` +
            (inDb ? c.dim(`  (${len.toLocaleString()} chars)`) : '')
        )
        dbMap.delete(key(r))
      }
    }
    if (dbMap.size) {
      console.log(c.dim('\n  Rows in the DB with no matching repo script:'))
      for (const r of dbMap.values()) console.log(c.dim(`    ${describe(r)}  ${String(r.title).slice(0, 50)}`))
    }
    console.log(
      `\n  ${existing.length} rows in the table, ${missing === 0 ? c.green('nothing missing') : c.yellow(missing + ' row(s) missing')}\n`
    )
    return
  }

  // Which files to push
  let files
  if (ALL) files = allFiles
  else {
    files = args
      .filter((a) => !a.startsWith('--'))
      .map((a) => (existsSync(a) ? a : join(ROOT, a)))
    for (const f of files) {
      if (!existsSync(f)) { console.error(c.red(`file not found: ${f}`)); process.exit(1) }
    }
  }

  if (!files.length) {
    console.error(
      `\n${c.red('Nothing to do.')}\n\n` +
        `  Pass files, or --all for every supabase/*-article.sql\n` +
        `  --status   show DB vs repo    --dry-run   preview    --help   full usage\n`
    )
    process.exit(1)
  }

  // Parse everything up front so a bad file fails before any writes.
  const parsed = []
  for (const f of files) {
    try { parsed.push(parseArticleSql(f)) }
    catch (e) { console.error(c.red(`\n${e.message}\n`)); process.exit(1) }
  }

  const totalRows = parsed.reduce((n, p) => n + p.rows.length, 0)
  console.log(c.bold(`\n${DRY ? 'DRY RUN, ' : ''}${parsed.length} file(s), ${totalRows} row(s)\n`))
  for (const p of parsed) {
    console.log(`  ${c.cyan(p.name)}`)
    for (const r of p.rows) {
      console.log(
        `    ${describe(r)}\n` +
          c.dim(`      title: ${r.title.slice(0, 68)}${r.title.length > 68 ? '…' : ''}\n`) +
          c.dim(`      body:  ${String(r.content).length.toLocaleString()} chars, format=${r.content_format || 'json'}`)
      )
    }
  }

  if (DRY) {
    console.log(c.dim('\n  Dry run, nothing was written.\n'))
    return
  }

  if (!SERVICE_KEY) {
    console.error(
      `\n${c.red('SUPABASE_SERVICE_KEY is not set.')}\n\n` +
        `  The anon key is read-only (RLS allows SELECT only), so writing needs the\n` +
        `  service_role key from: Supabase Dashboard -> Project Settings -> API\n\n` +
        `  ${c.bold('SUPABASE_SERVICE_KEY=xxx node scripts/push-articles.mjs --all')}\n\n` +
        `  That key bypasses RLS entirely. Never commit it or share it.\n` +
        `  Use --dry-run or --status to inspect things without a key.\n`
    )
    process.exit(1)
  }

  if (!YES) {
    console.log(
      c.yellow(`\n  This will DELETE the matching row(s) above and re-insert them.`) +
        c.dim(`\n  Other rows are untouched.\n`)
    )
    const a = await ask('  Continue? (y/N) ')
    if (a !== 'y' && a !== 'yes') { console.log(c.dim('\n  Aborted.\n')); return }
  }

  console.log('')
  let deleted = 0
  let inserted = 0
  let failed = 0
  for (const p of parsed) {
    for (const r of p.rows) {
      let removed = []
      try {
        removed = await deleteTarget(r)
        await insertRow(r)
        deleted += removed.length
        inserted++
        console.log(`  ${c.green('pushed')}  ${describe(r)} ${c.dim(`(replaced ${removed.length})`)}`)
      } catch (e) {
        console.error(`  ${c.red('failed')}  ${describe(r)}\n    ${e.message}`)
        // The delete may already have gone through, so put the old row back
        // rather than leaving the page with no article at all.
        if (removed.length) {
          const ok = await restore(removed)
          console.error(
            ok
              ? `    ${c.yellow(`rolled back, restored the previous row (${removed.length})`)}`
              : `    ${c.red('ROLLBACK FAILED')} , the previous row was deleted and could not be restored.\n` +
                `    Re-run this script with a valid service_role key to repopulate it.`
          )
        }
        failed++
        process.exitCode = 1
      }
    }
  }

  // Read back through the public (anon) path, i.e. exactly what the site sees.
  console.log(c.bold('\n  Verifying via the public read path…'))
  const after = await fetchExisting(ANON_KEY)
  for (const p of parsed) {
    for (const r of p.rows) {
      const found = after.find(
        (x) =>
          x.page_type === r.page_type &&
          (x.city_slug || null) === (r.city_slug || null) &&
          (x.service_slug || null) === (r.service_slug || null) &&
          (x.area_slug || null) === (r.area_slug || null)
      )
      const len = found ? String(found.content ?? '').length : 0
      const ok = found && len > 500
      console.log(
        `    ${ok ? c.green('ok') : c.red('MISSING')}  ${describe(r)} ${c.dim(`${len.toLocaleString()} chars`)}`
      )
      if (!ok) process.exitCode = 1
    }
  }

  if (failed) {
    console.log(
      `\n  ${c.red(`${failed} row(s) FAILED`)}, ${inserted} pushed, ${deleted} replaced. ` +
        `Table has ${after.length} rows.\n` +
        c.dim('  Nothing was partially written: each row is delete-then-insert, and a\n') +
        c.dim('  failed insert leaves that target absent rather than half-written.\n') +
        c.yellow('  If this is a 42501 / RLS error, the key is not a service_role key.\n')
    )
    return
  }

  console.log(
    `\n  ${c.green(`${inserted} row(s) pushed`)}, ${deleted} replaced. Table now has ${after.length} rows.\n` +
      c.dim('  Content is live immediately, the site reads it at runtime (no deploy needed).\n')
  )
}

main().catch((e) => {
  console.error(c.red(`\n${e.stack || e.message}\n`))
  process.exit(1)
})
