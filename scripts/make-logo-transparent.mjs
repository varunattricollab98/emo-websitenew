import sharp from 'sharp'

const SRC = 'public/emo-logo.webp'
const OUT = 'public/emo-logo.webp'

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
let cleared = 0
for (let i = 0; i < data.length; i += channels) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const whiteness = Math.min(r, g, b) // high only when pixel is near-white
  let a
  if (whiteness <= 228) a = 255
  else if (whiteness >= 250) a = 0
  else a = Math.round((255 * (250 - whiteness)) / 22) // soft edge ramp
  if (a < data[i + 3]) {
    data[i + 3] = a
    if (a === 0) cleared++
  }
}

await sharp(data, { raw: { width, height, channels } })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT + '.tmp')

// swap in
const fs = await import('node:fs')
fs.renameSync(OUT + '.tmp', OUT)

console.log(`✓ ${OUT}: ${cleared} white px → transparent (${width}x${height})`)
