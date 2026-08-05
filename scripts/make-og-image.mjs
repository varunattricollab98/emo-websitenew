#!/usr/bin/env node
/**
 * Generates public/og-image.png — the 1200x630 social share card.
 *
 * Written with zero image dependencies: PNG is encoded by hand using node's
 * built-in zlib. Rendered at 3x and downsampled, which gives clean anti-aliased
 * edges without any easing maths.
 *
 * The artwork mirrors the site's own visual language:
 *   - 135deg navy -> primary gradient (same stops as tailwind primary-gradient)
 *   - gold accent bar along the top (used on every card in the UI)
 *   - soft corner glows and a faint dot grid (tech-dots motif)
 *   - the EaseMyOffice mark, taken from public/favicon.svg
 *
 * Re-run after changing brand colours:  node scripts/make-og-image.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const W = 1200
const H = 630
const SS = 3 // supersample factor
const CW = W * SS
const CH = H * SS

// ── Brand palette (from tailwind.config.js) ─────────────────────────────────
const NAVY_DARK = [0x0f, 0x1a, 0x2e]
const NAVY = [0x11, 0x41, 0x7c]
const PRIMARY = [0x2c, 0x67, 0x9e]
const PRIMARY_300 = [0x93, 0xc3, 0xe5]
const GOLD = [0xf5, 0x9e, 0x0b]
const GOLD_DARK = [0xd9, 0x77, 0x06]
const WHITE = [0xff, 0xff, 0xff]

// ── Canvas ──────────────────────────────────────────────────────────────────
const buf = new Uint8Array(CW * CH * 3)

const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0)

function put(x, y, rgb, alpha = 1) {
  // Coordinates MUST be integers: a fractional index into a TypedArray is
  // silently dropped (or lands on the wrong pixel), which produces displaced
  // artefacts rather than an obvious error.
  x |= 0
  y |= 0
  if (x < 0 || y < 0 || x >= CW || y >= CH) return
  const i = (y * CW + x) * 3
  if (alpha >= 1) {
    buf[i] = rgb[0]
    buf[i + 1] = rgb[1]
    buf[i + 2] = rgb[2]
    return
  }
  buf[i] = clamp255(buf[i] * (1 - alpha) + rgb[0] * alpha)
  buf[i + 1] = clamp255(buf[i + 1] * (1 - alpha) + rgb[1] * alpha)
  buf[i + 2] = clamp255(buf[i + 2] * (1 - alpha) + rgb[2] * alpha)
}

const lerp = (a, b, t) => a + (b - a) * t
const mix = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t),
]

/** Multi-stop gradient sampler. stops = [[position, rgb], ...] */
function sampleStops(stops, t) {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [p0, c0] = stops[i - 1]
      const [p1, c1] = stops[i]
      return mix(c0, c1, (t - p0) / (p1 - p0))
    }
  }
  return stops[stops.length - 1][1]
}

// ── 1. Background: 135deg gradient ──────────────────────────────────────────
const bgStops = [
  [0, NAVY_DARK],
  [0.55, NAVY],
  [1, PRIMARY],
]
for (let y = 0; y < CH; y++) {
  for (let x = 0; x < CW; x++) {
    const t = (x / CW + y / CH) / 2
    put(x, y, sampleStops(bgStops, t))
  }
}

// ── 2. Soft corner glows (mirrors the blur-3xl blobs in the UI) ──────────────
function glow(cx, cy, radius, rgb, strength) {
  const r2 = radius * radius
  const x0 = Math.max(0, (cx - radius) | 0)
  const x1 = Math.min(CW, (cx + radius) | 0)
  const y0 = Math.max(0, (cy - radius) | 0)
  const y1 = Math.min(CH, (cy + radius) | 0)
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      if (d2 > r2) continue
      const f = 1 - Math.sqrt(d2) / radius
      put(x, y, rgb, f * f * strength)
    }
  }
}
glow(CW * 0.86, CH * 0.12, CH * 0.62, PRIMARY_300, 0.3)
glow(CW * 0.1, CH * 0.95, CH * 0.55, GOLD, 0.12)

// ── 3. Faint dot grid ───────────────────────────────────────────────────────
const DOT_GAP = 26 * SS
const DOT_R = 1.6 * SS
for (let gy = DOT_GAP; gy < CH; gy += DOT_GAP) {
  for (let gx = DOT_GAP; gx < CW; gx += DOT_GAP) {
    for (let dy = -DOT_R; dy <= DOT_R; dy++) {
      for (let dx = -DOT_R; dx <= DOT_R; dx++) {
        if (dx * dx + dy * dy > DOT_R * DOT_R) continue
        put((gx + dx) | 0, (gy + dy) | 0, WHITE, 0.05)
      }
    }
  }
}

// ── 4. Gold accent bar along the top ────────────────────────────────────────
const BAR_H = 10 * SS
for (let y = 0; y < BAR_H; y++) {
  for (let x = 0; x < CW; x++) {
    put(x, y, mix(GOLD, GOLD_DARK, x / CW))
  }
}

// ── 5. Brand mark, scaled from public/favicon.svg (viewBox 0 0 32 32) ───────
// favicon.svg = rounded square (rx 7) with gradient + white building glyph:
//   path "M9 22V12l7-4 7 4v10h-4v-6h-6v6H9z"
const MARK = 260 * SS // rendered size of the rounded square
const MX = (CW - MARK) / 2 // centred
const MY = Math.round(CH * 0.44 - MARK / 2)
const SVG = 32
const u = MARK / SVG // one SVG unit in device pixels
const RX = 7 * u

// 5a. rounded square with its own diagonal gradient
for (let y = 0; y < MARK; y++) {
  for (let x = 0; x < MARK; x++) {
    // inside-rounded-rect test
    let inside = true
    const corners = [
      [RX, RX, x < RX && y < RX],
      [MARK - RX, RX, x > MARK - RX && y < RX],
      [RX, MARK - RX, x < RX && y > MARK - RX],
      [MARK - RX, MARK - RX, x > MARK - RX && y > MARK - RX],
    ]
    for (const [ccx, ccy, isCorner] of corners) {
      if (isCorner && (x - ccx) ** 2 + (y - ccy) ** 2 > RX * RX) inside = false
    }
    if (!inside) continue
    put(MX + x, MY + y, mix(PRIMARY, NAVY, (x / MARK + y / MARK) / 2))
  }
}

// 5b. white building glyph — the SVG path resolved to polygon points
const glyph = [
  [9, 22],
  [9, 12],
  [16, 8],
  [23, 12],
  [23, 22],
  [19, 22],
  [19, 16],
  [13, 16],
  [13, 22],
].map(([gx, gy]) => [MX + gx * u, MY + gy * u])

// even-odd scanline polygon fill
function fillPolygon(pts, rgb) {
  const ys = pts.map((p) => p[1])
  const yMin = Math.max(0, Math.floor(Math.min(...ys)))
  const yMax = Math.min(CH - 1, Math.ceil(Math.max(...ys)))
  for (let y = yMin; y <= yMax; y++) {
    const xs = []
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i]
      const [x2, y2] = pts[(i + 1) % pts.length]
      if (y1 === y2) continue
      const yc = y + 0.5
      if (yc >= Math.min(y1, y2) && yc < Math.max(y1, y2)) {
        xs.push(x1 + ((yc - y1) / (y2 - y1)) * (x2 - x1))
      }
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) {
      for (let x = Math.ceil(xs[i]); x < xs[i + 1]; x++) put(x, y, rgb)
    }
  }
}
fillPolygon(glyph, WHITE)

// ── 5c. Wordmark "EaseMyOffice" ─────────────────────────────────────────────
// Drawn as monoline geometric type: every glyph is a set of straight strokes
// and arcs with round caps, so it stays crisp at any size and needs no font.

// NOTE: no wordmark is drawn. Rendering "EaseMyOffice" as letterforms without a
// real font file produced visibly malformed glyphs (s, e and c in particular),
// which looks worse than a clean mark-only card. Every social platform renders
// og:title as text beside the image, so the brand name is still shown.
// Drop any 1200x630 JPG/PNG into public/ as og-image.jpg to override this card.

// thin gold rule under the mark
const RULE_W = 150 * SS
const RULE_H = 5 * SS
const RULE_X = (CW - RULE_W) / 2
const RULE_Y = Math.round(CH * 0.72)
for (let y = 0; y < RULE_H; y++) {
  for (let x = 0; x < RULE_W; x++) {
    put(RULE_X + x, RULE_Y + y, mix(GOLD, GOLD_DARK, x / RULE_W))
  }
}

// ── 6. Downsample SS -> 1 (box filter = anti-aliasing) ──────────────────────
const out = new Uint8Array(W * H * 3)
const n = SS * SS
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let r = 0
    let g = 0
    let b = 0
    for (let sy = 0; sy < SS; sy++) {
      const row = (y * SS + sy) * CW
      for (let sx = 0; sx < SS; sx++) {
        const i = (row + x * SS + sx) * 3
        r += buf[i]
        g += buf[i + 1]
        b += buf[i + 2]
      }
    }
    const o = (y * W + x) * 3
    out[o] = (r / n) | 0
    out[o + 1] = (g / n) | 0
    out[o + 2] = (b / n) | 0
  }
}

// ── 7. Encode PNG by hand ───────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(bytes) {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, Buffer.from(data)])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 2 // colour type 2 = truecolour RGB
ihdr[10] = 0 // deflate
ihdr[11] = 0 // adaptive filtering
ihdr[12] = 0 // no interlace

// scanlines, each prefixed with filter byte 0 (None)
const raw = Buffer.alloc(H * (1 + W * 3))
for (let y = 0; y < H; y++) {
  const o = y * (1 + W * 3)
  raw[o] = 0
  Buffer.from(out.buffer, y * W * 3, W * 3).copy(raw, o + 1)
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

const outPath = fileURLToPath(new URL('../public/og-image.png', import.meta.url))
writeFileSync(outPath, png)
console.log(
  `\u2713 og-image.png written: ${W}x${H}, ${(png.length / 1024).toFixed(1)} KB -> public/og-image.png`
)
