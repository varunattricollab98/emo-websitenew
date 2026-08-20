/**
 * Password hashing for admin accounts, using the browser's native Web Crypto.
 *
 * Scheme: PBKDF2-HMAC-SHA256, 150k iterations, 16-byte random salt.
 * The derived hash is stored in `admin_users.password` and the salt in
 * `admin_users.password_salt`.
 *
 * LEGACY SUPPORT: rows created before this migration hold a plaintext password
 * and have `password_salt = NULL`. `verifyPassword` detects that and falls back
 * to a direct comparison, so nobody is locked out. Call sites should then
 * re-save the password through `hashPassword` to silently upgrade the row.
 */

const ITERATIONS = 150_000
const KEY_BITS = 256

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

/** True when the environment can actually do PBKDF2 (needs HTTPS or localhost). */
export function isCryptoAvailable() {
  return typeof crypto !== 'undefined' && !!crypto.subtle
}

/** 16 random bytes as a 32-char hex string. */
export function generateSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

/** Derive the PBKDF2 hash of `password` with `salt`. Returns a hex string. */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: fromHex(salt),
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_BITS
  )
  return toHex(bits)
}

/**
 * Hash a fresh password for storage.
 * @returns {{ password: string, password_salt: string }} ready to spread into an update payload
 */
export async function createPasswordFields(plainPassword) {
  if (!isCryptoAvailable()) {
    // Extremely unlikely (would mean an insecure context). Store as-is rather
    // than silently failing, and leave the salt null so verify() still works.
    return { password: plainPassword, password_salt: null }
  }
  const salt = generateSalt()
  const hash = await hashPassword(plainPassword, salt)
  return { password: hash, password_salt: salt }
}

/**
 * Check a login attempt against a stored record.
 *
 * @param {string} plainPassword what the user typed
 * @param {string} storedPassword the `password` column (hash OR legacy plaintext)
 * @param {string|null} storedSalt the `password_salt` column
 * @returns {Promise<{ ok: boolean, needsUpgrade: boolean }>}
 *          `needsUpgrade` is true when the row was still plaintext, so the
 *          caller can re-save it as a hash.
 */
export async function verifyPassword(plainPassword, storedPassword, storedSalt) {
  const typed = (plainPassword ?? '').trim()
  const stored = storedPassword ?? ''

  // Legacy plaintext row — no salt was ever generated.
  if (!storedSalt) {
    return { ok: typed === stored.trim(), needsUpgrade: typed === stored.trim() }
  }

  if (!isCryptoAvailable()) {
    return { ok: false, needsUpgrade: false }
  }

  const hash = await hashPassword(typed, storedSalt)
  return { ok: timingSafeEqual(hash, stored), needsUpgrade: false }
}

/** Constant-time-ish string compare so we don't leak length/prefix via timing. */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/** URL-safe random token for the password-reset link. */
export function generateResetToken() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

/** Basic strength check used by the reset + user-editor forms. */
export function validatePasswordStrength(password) {
  const pw = password ?? ''
  if (pw.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(pw)) return 'Password must contain at least one letter.'
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.'
  return null
}
