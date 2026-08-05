#!/usr/bin/env node
/**
 * Generates public/og-image.png — the 1200x630 social share card.
 *
 * Fetches the EaseMyOffice logo from Supabase Storage, places it centered on a
 * branded gradient background (matching the site's visual language), and writes
 * a dependency-free PNG using node's built-in zlib.
 *
 * Re-run after changing logo or brand colours: node scripts/make-og-image.mjs
 */
import { deflateSync, inflateSync } from 'node:zlib'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import https from 'node:https'

const W = 1200
const H = 630
const SS = 2 // supersample factor
const CW = W * SS
const CH = H * SS

// Logo URL from Supabase Storage
const LOGO_URL =
  'https://oijtkvkyefqfwuycibcv.supabase.co/storage/v1/object/public/website-assets/EaseMyOffice-Logo-1.png'

// ── Brand palette ───────────────────────────────────────────────────────────
const NAVY_DARK = [0x0f, 0x1a, 0x2e]
const NAVY = [0x11, 0x41, 0x7c]
const PRIMARY = [0x2c, 0x67, 0x9e]
const PRIMARY_300 = [0x93, 0xc3, 0xe5]
const GOLD = [0xf5, 0x9e, 0x0b]
const GOLD_DARK = [0xd9, 0x77, 0x06]
const WHITE = [0xff, 0xff, 0xff]

// ── Helpers ─────────────────────────────────────────────────────────────────
const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0)
const lerp = (a, b, t) => a + (b - a) * t
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]

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

// ── PNG decoder (minimal, handles 8-bit RGBA and RGB) ───────────────────────
function decodePNG(buffer) {
  // Verify PNG signature
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== sig[i]) throw new Error('Not a valid PNG')
  }

  let offset = 8
  let width, height, bitDepth, colorType
  const idatChunks = []

  while (offset < buffer.length) {
    const len = buffer.readUInt32BE(offset)
    const type = buffer.slice(offset + 4, offset + 8).toString('ascii')
    const data = buffer.slice(offset + 8, offset + 8 + len)
    offset += 12 + len

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  const compressed = Buffer.concat(idatChunks)
  const raw = inflateSync(compressed)

  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1
  const bpp = (channels * bitDepth) / 8
  const scanlineLen = width * bpp

  // Unfilter
  const pixels = Buffer.alloc(height * scanlineLen)
  for (let y = 0; y < height; y++) {
    const filterByte = raw[y * (scanlineLen + 1)]
    const rowStart = y * (scanlineLen + 1) + 1
    const outStart = y * scanlineLen

    for (let x = 0; x < scanlineLen; x++) {
      const rawByte = raw[rowStart + x]
      const a = x >= bpp ? pixels[outStart + x - bpp] : 0
      const b = y > 0 ? pixels[outStart - scanlineLen + x] : 0
      const c = x >= bpp && y > 0 ? pixels[outStart - scanlineLen + x - bpp] : 0

      let val
      switch (filterByte) {
        case 0:
          val = rawByte
          break
        case 1:
          val = rawByte + a
          break
        case 2:
          val = rawByte + b
          break
        case 3:
          val = rawByte + ((a + b) >> 1)
          break
        case 4: {
          // Paeth
          const p = a + b - c
          const pa = Math.abs(p - a)
          const pb = Math.abs(p - b)
          const pc = Math.abs(p - c)
          val = rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
          break
        }
        default:
          val = rawByte
      }
      pixels[outStart + x] = val & 0xff
    }
  }

  // Convert to RGBA
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    if (channels === 4) {
      rgba[i * 4] = pixels[i * 4]
      rgba[i * 4 + 1] = pixels[i * 4 + 1]
      rgba[i * 4 + 2] = pixels[i * 4 + 2]
      rgba[i * 4 + 3] = pixels[i * 4 + 3]
    } else if (channels === 3) {
      rgba[i * 4] = pixels[i * 3]
      rgba[i * 4 + 1] = pixels[i * 3 + 1]
      rgba[i * 4 + 2] = pixels[i * 3 + 2]
      rgba[i * 4 + 3] = 255
    } else if (channels === 2) {
      rgba[i * 4] = pixels[i * 2]
      rgba[i * 4 + 1] = pixels[i * 2]
      rgba[i * 4 + 2] = pixels[i * 2]
      rgba[i * 4 + 3] = pixels[i * 2 + 1]
    } else {
      rgba[i * 4] = pixels[i]
      rgba[i * 4 + 1] = pixels[i]
      rgba[i * 4 + 2] = pixels[i]
      rgba[i * 4 + 3] = 255
    }
  }

  return { width, height, rgba }
}

// ── Fetch logo from URL ─────────────────────────────────────────────────────
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : require('http').get
    get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve, reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ── Canvas ──────────────────────────────────────────────────────────────────
const canvas = new Uint8Array(CW * CH * 3)

function put(x, y, rgb, alpha = 1) {
  x |= 0
  y |= 0
  if (x < 0 || y < 0 || x >= CW || y >= CH) return
  const i = (y * CW + x) * 3
  if (alpha >= 1) {
    canvas[i] = rgb[0]
    canvas[i + 1] = rgb[1]
    canvas[i + 2] = rgb[2]
    return
  }
  canvas[i] = clamp255(canvas[i] * (1 - alpha) + rgb[0] * alpha)
  canvas[i + 1] = clamp255(canvas[i + 1] * (1 - alpha) + rgb[1] * alpha)
  canvas[i + 2] = clamp255(canvas[i + 2] * (1 - alpha) + rgb[2] * alpha)
}

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

// ── Draw background ─────────────────────────────────────────────────────────
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

// Soft corner glows
glow(CW * 0.86, CH * 0.12, CH * 0.62, PRIMARY_300, 0.25)
glow(CW * 0.1, CH * 0.95, CH * 0.55, GOLD, 0.1)

// Faint dot grid
const DOT_GAP = 26 * SS
const DOT_R = 1.5 * SS
for (let gy = DOT_GAP; gy < CH; gy += DOT_GAP) {
  for (let gx = DOT_GAP; gx < CW; gx += DOT_GAP) {
    for (let dy = -DOT_R; dy <= DOT_R; dy++) {
      for (let dx = -DOT_R; dx <= DOT_R; dx++) {
        if (dx * dx + dy * dy > DOT_R * DOT_R) continue
        put((gx + dx) | 0, (gy + dy) | 0, WHITE, 0.04)
      }
    }
  }
}

// Gold accent bar along the top
const BAR_H = 8 * SS
for (let y = 0; y < BAR_H; y++) {
  for (let x = 0; x < CW; x++) {
    put(x, y, mix(GOLD, GOLD_DARK, x / CW))
  }
}

// Gold rule under center
const RULE_W = 140 * SS
const RULE_H = 4 * SS
const RULE_X = (CW - RULE_W) / 2
const RULE_Y = Math.round(CH * 0.82)
for (let y = 0; y < RULE_H; y++) {
  for (let x = 0; x < RULE_W; x++) {
    put(RULE_X + x, RULE_Y + y, mix(GOLD, GOLD_DARK, x / RULE_W))
  }
}

// ── Place logo ──────────────────────────────────────────────────────────────
async function main() {
  let logoImg

  // Try to fetch from URL, fallback to local file
  try {
    console.log('Fetching logo from Supabase...')
    const logoBuf = await fetchBuffer(LOGO_URL)
    logoImg = decodePNG(logoBuf)
    console.log(`Logo decoded: ${logoImg.width}x${logoImg.height}`)
  } catch (e) {
    console.warn(`Could not fetch logo: ${e.message}`)
    // Try local fallback
    const localPath = fileURLToPath(new URL('../public/emo-logo-full.webp', import.meta.url))
    if (existsSync(localPath)) {
      console.log('Using local fallback (mark-only mode)')
    } else {
      console.log('No logo available, generating mark-only card')
    }
    logoImg = null
  }

  if (logoImg) {
    // Scale logo to fit nicely in the card (max 55% width, max 40% height)
    const maxW = CW * 0.55
    const maxH = CH * 0.40
    const scale = Math.min(maxW / logoImg.width, maxH / logoImg.height)
    const lw = Math.round(logoImg.width * scale)
    const lh = Math.round(logoImg.height * scale)
    const lx = Math.round((CW - lw) / 2)
    const ly = Math.round((CH - lh) / 2 - CH * 0.03) // slightly above center

    // Bilinear resize + alpha composite
    for (let y = 0; y < lh; y++) {
      for (let x = 0; x < lw; x++) {
        // Source coordinates
        const sx = (x / lw) * logoImg.width
        const sy = (y / lh) * logoImg.height
        const sx0 = Math.min(Math.floor(sx), logoImg.width - 1)
        const sy0 = Math.min(Math.floor(sy), logoImg.height - 1)
        const sx1 = Math.min(sx0 + 1, logoImg.width - 1)
        const sy1 = Math.min(sy0 + 1, logoImg.height - 1)
        const fx = sx - sx0
        const fy = sy - sy0

        // Bilinear sample
        const idx = (py, px) => (py * logoImg.width + px) * 4
        const i00 = idx(sy0, sx0)
        const i10 = idx(sy0, sx1)
        const i01 = idx(sy1, sx0)
        const i11 = idx(sy1, sx1)

        const r =
          logoImg.rgba[i00] * (1 - fx) * (1 - fy) +
          logoImg.rgba[i10] * fx * (1 - fy) +
          logoImg.rgba[i01] * (1 - fx) * fy +
          logoImg.rgba[i11] * fx * fy
        const g =
          logoImg.rgba[i00 + 1] * (1 - fx) * (1 - fy) +
          logoImg.rgba[i10 + 1] * fx * (1 - fy) +
          logoImg.rgba[i01 + 1] * (1 - fx) * fy +
          logoImg.rgba[i11 + 1] * fx * fy
        const b =
          logoImg.rgba[i00 + 2] * (1 - fx) * (1 - fy) +
          logoImg.rgba[i10 + 2] * fx * (1 - fy) +
          logoImg.rgba[i01 + 2] * (1 - fx) * fy +
          logoImg.rgba[i11 + 2] * fx * fy
        const a =
          logoImg.rgba[i00 + 3] * (1 - fx) * (1 - fy) +
          logoImg.rgba[i10 + 3] * fx * (1 - fy) +
          logoImg.rgba[i01 + 3] * (1 - fx) * fy +
          logoImg.rgba[i11 + 3] * fx * fy

        const alpha = a / 255
        if (alpha > 0.01) {
          // Enhance: slight brightness boost for dark logos on dark bg
          const enhance = 1.05
          put(
            lx + x,
            ly + y,
            [clamp255(r * enhance), clamp255(g * enhance), clamp255(b * enhance)],
            alpha
          )
        }
      }
    }
  } else {
    // Fallback: draw the building mark from favicon.svg
    const MARK = 260 * SS
    const MX = (CW - MARK) / 2
    const MY = Math.round(CH * 0.44 - MARK / 2)
    const SVG = 32
    const u = MARK / SVG
    const RX = 7 * u

    for (let y = 0; y < MARK; y++) {
      for (let x = 0; x < MARK; x++) {
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

    const glyph = [
      [9, 22], [9, 12], [16, 8], [23, 12], [23, 22], [19, 22], [19, 16], [13, 16], [13, 22],
    ].map(([gx, gy]) => [MX + gx * u, MY + gy * u])

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
  }

  // ── Downsample SS -> 1 ──────────────────────────────────────────────────────
  const out = new Uint8Array(W * H * 3)
  const n = SS * SS
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < SS; sy++) {
        const row = (y * SS + sy) * CW
        for (let sx = 0; sx < SS; sx++) {
          const i = (row + x * SS + sx) * 3
          r += canvas[i]
          g += canvas[i + 1]
          b += canvas[i + 2]
        }
      }
      const o = (y * W + x) * 3
      out[o] = (r / n) | 0
      out[o + 1] = (g / n) | 0
      out[o + 2] = (b / n) | 0
    }
  }

  // ── Encode PNG ──────────────────────────────────────────────────────────────
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
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

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
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
