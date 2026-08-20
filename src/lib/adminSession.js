/**
 * Single source of truth for the admin session.
 *
 * The session lives in sessionStorage (cleared when the tab closes):
 *   admin_service_key  — Supabase service_role JWT, also the "logged in" flag
 *   admin_role         — role name (admin | manager | editor | viewer)
 *   admin_permissions  — JSON array of permission keys
 *   admin_name         — display name
 *   admin_username     — username, used for audit logging
 *   admin_user_id      — admin_users.id
 *   admin_login_at     — epoch ms, used for the idle/session timeout
 *   admin_timeout_min  — session timeout from admin_settings
 *
 * NOTE ON SECURITY: because the browser holds the service_role key, these
 * client-side checks are a UX guardrail, not a security boundary. Anyone who
 * can open devtools can edit sessionStorage. Treat admin access itself as the
 * trust boundary and only hand the panel to people you trust.
 */

import { parsePermissions, hasPermission, hasAnyPermission } from './permissions'

const KEYS = [
  'admin_service_key',
  'admin_role',
  'admin_permissions',
  'admin_name',
  'admin_username',
  'admin_user_id',
  'admin_login_at',
  'admin_timeout_min',
]

const DEFAULT_TIMEOUT_MIN = 480 // 8 hours

/** Persist a successful login. */
export function saveSession({
  serviceKey,
  role,
  permissions,
  name,
  username,
  userId,
  timeoutMinutes,
}) {
  sessionStorage.setItem('admin_service_key', serviceKey)
  sessionStorage.setItem('admin_role', role || 'viewer')
  sessionStorage.setItem('admin_permissions', JSON.stringify(permissions ?? []))
  sessionStorage.setItem('admin_name', name || '')
  sessionStorage.setItem('admin_username', username || '')
  sessionStorage.setItem('admin_user_id', userId || '')
  sessionStorage.setItem('admin_login_at', String(Date.now()))
  sessionStorage.setItem(
    'admin_timeout_min',
    String(timeoutMinutes || DEFAULT_TIMEOUT_MIN)
  )
}

export function clearSession() {
  KEYS.forEach((k) => sessionStorage.removeItem(k))
}

/** True when the session is older than the configured timeout. */
export function isSessionExpired() {
  const loginAt = Number(sessionStorage.getItem('admin_login_at') || 0)
  if (!loginAt) return false // legacy session without a timestamp — let it through
  const timeoutMin =
    Number(sessionStorage.getItem('admin_timeout_min')) || DEFAULT_TIMEOUT_MIN
  return Date.now() - loginAt > timeoutMin * 60 * 1000
}

/** Read the current session synchronously. */
export function readSession() {
  const serviceKey = sessionStorage.getItem('admin_service_key')
  if (!serviceKey) return null

  const role = sessionStorage.getItem('admin_role') || 'viewer'
  return {
    serviceKey,
    role,
    permissions: parsePermissions(
      sessionStorage.getItem('admin_permissions'),
      role
    ),
    name: sessionStorage.getItem('admin_name') || 'Admin',
    username: sessionStorage.getItem('admin_username') || '',
    userId: sessionStorage.getItem('admin_user_id') || '',
  }
}

/** Permission check against the live session. */
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
 * Best-effort audit trail. Never throws — if the table is missing or the
 * insert fails we just skip it rather than breaking the action.
 */
export async function logAudit(client, action, detail) {
  if (!client) return
  try {
    await client.from('admin_audit_log').insert({
      username: sessionStorage.getItem('admin_username') || null,
      action,
      detail: detail ? String(detail).slice(0, 500) : null,
    })
  } catch {
    /* audit logging is optional */
  }
}
