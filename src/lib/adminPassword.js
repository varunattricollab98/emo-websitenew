/**
 * Password rules for admin accounts.
 *
 * NOTE: this file used to implement PBKDF2 hashing because we stored passwords
 * ourselves in `admin_users`. Supabase Auth owns passwords now — it hashes,
 * stores, verifies and resets them — so all of that has been removed. What is
 * left is the client-side strength check we show before handing the password to
 * Supabase.
 */

/** @returns {string|null} an error message, or null when the password is fine */
export function validatePasswordStrength(password) {
  const pw = password ?? ''
  if (pw.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(pw)) return 'Password must contain at least one letter.'
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.'
  return null
}
