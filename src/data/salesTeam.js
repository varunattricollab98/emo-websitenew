// ── Sales Team WhatsApp Numbers ──────────────────────────────
// Add or remove numbers here — the site randomly picks one on each click.
// Format: country code + number (no + sign, no spaces).
//
// Example: '918882735038' = +91 88827 35038
//
// To add a new person: just add their number to the array.
// To remove: delete the line. That's it!

export const salesNumbers = [
  '918882735038',
  // '919876543210',  // ← uncomment or add new numbers here
  // '919988776655',
]

/**
 * Returns a random WhatsApp number from the sales team.
 * If only one number exists, it always returns that one.
 */
export function getRandomSalesWhatsApp() {
  const idx = Math.floor(Math.random() * salesNumbers.length)
  return salesNumbers[idx]
}

/**
 * Returns the full wa.me link with a random sales number.
 */
export function getWhatsAppLink(message = '') {
  const num = getRandomSalesWhatsApp()
  const base = `https://wa.me/${num}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
