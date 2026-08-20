/**
 * Admin session state.
 *
 * The authoritative session is Supabase Auth's (managed by the client in
 * supabaseAdmin.js). The role + permissions come from the `admin_users` table.
 *
 * We keep a small cache of the profile so UI code can check permissions
 * synchronously (to hide buttons, filter nav links, etc.). That cache is a
 * CONVENIENCE ONLY — every read and write is independently enforced by RLS
 * policies in the database, so tampering with it just means the UI shows a
 * control that the database then refuses. That is the key difference from the
 * old design, where sessionStorage *was* the security boundary.
 */

import { parsePermissions, hasPermission, hasAnyPermission } from './permissions'

const CACHE_KEY = 'emo_admin_profile'
const LOGIN_AT_KEY = 'emo_admin_login_at'
const TIMEOUT_KEY = 'emo_admin_timeout_min'

const DEFAULT_TIMEOUT_MIN = 480 // 8 hours

let memoryProfile = null

/** Cache the profile after login / refresh. */
export function setCachedProfile(profile, timeoutMinutes) {
  memoryProfile = profile || null
  try {
    if (profile) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(profile))
      if (!sessionStorage.getItem(LOGIN_AT_KEY)) {
        sessionStorage.setItem(LOGIN_AT_KEY, String(Date.now()))
      }
      if (timeoutMinutes) {
        sessionStorage.setItem(TIMEOUT_KEY, String(timeoutMinutes))
      }
    } else {
      sessionStorage.removeItem(CACHE_KEY)
    }
  } catch {
    /* private-mode storage — memory cache still works */
  }
}

export function clearSession() {
  memoryProfile = null
  try {
    sessionStorage.removeItem(CACHE_KEY)
    sessionStorage.removeItem(LOGIN_AT_KEY)
    sessionStorage.removeItem(TIMEOUT_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Read the cached admin profile synchronously.
 * Returns null when nobody is signed in.
 */
export function readSession() {
  if (memoryProfile) return normalise(memoryProfile)
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    memoryProfile = JSON.parse(raw)
    return normalise(memoryProfile)
  } catch {
    return null
  }
}

function normalise(profile) {
  return {
    id: profile.id,
    username: profile.username || profile.email || '',
    email: profile.email || profile.authEmail || '',
    name: profile.name || profile.username || 'Admin',
    role: profile.role || 'viewer',
    permissions: parsePermissions(profile.permissions, profile.role),
    authUserId: profile.authUserId,
  }
}

/**
 * Optional idle timeout on top of Supabase's own token expiry, driven by the
 * `session_timeout_minutes` setting in admin_settings.
 */
export function isSessionExpired() {
  try {
    const loginAt = Number(sessionStorage.getItem(LOGIN_AT_KEY) || 0)
    if (!loginAt) return false
    const timeoutMin =
      Number(sessionStorage.getItem(TIMEOUT_KEY)) || DEFAULT_TIMEOUT_MIN
    return Date.now() - loginAt > timeoutMin * 60 * 1000
  } catch {
    return false
  }
}

/** Synchronous permission check against the cached profile. */
export function sessionCan(permission) {
  const session = readSession()
  if (!session) return false
  return hasPermission(session.permissions, permission)
}

export function sessionCanAny(permissionList) {
  const session = readSession()
  if (!session) return false
  return hasAnyPermission(session.permissions, permissionList)
}

/**
 * Best-effort audit trail. Never throws — if the insert is refused we skip it
 * rather than breaking the action the user was performing.
 */
export async function logAudit(client, action, detail) {
  if (!client) return
  try {
    const session = readSession()
    await client.from('admin_audit_log').insert({
      username: session?.username || session?.email || null,
      action,
      detail: detail ? String(detail).slice(0, 500) : null,
    })
  } catch {
    /* audit logging is optional */
  }
}
