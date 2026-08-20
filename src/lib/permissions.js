/**
 * Admin permission catalogue + role presets.
 *
 * A user's `permissions` column is a JSON array of permission keys, e.g.
 *   ["blog.view", "blog.edit", "leads.view"]
 *
 * The wildcard "*" grants everything (used by the `admin` role).
 * A section wildcard like "blog.*" grants every action in that section.
 */

// ─── Sections & their actions ───────────────────────────────────────────────
// `path` is used by AdminNav + the route guard to map a page to its section.
export const PERMISSION_SECTIONS = [
  {
    key: 'leads',
    label: 'Leads',
    path: '/admin/leads',
    description: 'Customer enquiries submitted through the website',
    actions: ['view', 'edit', 'delete', 'export'],
  },
  {
    key: 'blog',
    label: 'Blog Posts',
    path: '/admin/blog',
    description: 'Blog articles shown under /blog',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'articles',
    label: 'Page Articles',
    path: '/admin/articles',
    description: 'Long-form content injected into city & service pages',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'coworking',
    label: 'Coworking Spaces',
    path: '/admin/coworking',
    description: 'Coworking listings, pricing and amenities',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'spaces',
    label: 'Virtual Offices',
    path: '/admin/spaces',
    description: 'Virtual office listings, pricing and locations',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'jobs',
    label: 'Job Openings',
    path: '/admin/jobs',
    description: 'Careers page vacancies',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'pages',
    label: 'Site Pages',
    path: '/admin/pages',
    description: 'Legal & static page content (terms, privacy, etc.)',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'users',
    label: 'Users & Access',
    path: '/admin/users',
    description: 'Create admin users and assign their permissions',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    description: 'Global login control, lockout rules and session timeout',
    actions: ['view', 'edit'],
  },
]

export const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
}

/** Flat list of every valid permission key, e.g. ['leads.view', ...] */
export const ALL_PERMISSIONS = PERMISSION_SECTIONS.flatMap((s) =>
  s.actions.map((a) => `${s.key}.${a}`)
)

// ─── Role presets ──────────────────────────────────────────────────────────
// Selecting a role in the user editor pre-ticks these boxes. The admin can
// then fine-tune individual checkboxes — the saved permissions array is what
// actually governs access, not the role name.
export const ROLE_PRESETS = {
  admin: {
    label: 'Administrator',
    description: 'Full access to everything, including users and settings.',
    badge: 'bg-purple-100 text-purple-700',
    permissions: ['*'],
  },
  manager: {
    label: 'Manager',
    description: 'Manages all content and leads, but cannot change users or settings.',
    badge: 'bg-blue-100 text-blue-700',
    permissions: [
      'leads.view', 'leads.edit', 'leads.export',
      'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
      'articles.view', 'articles.create', 'articles.edit', 'articles.delete',
      'coworking.view', 'coworking.create', 'coworking.edit', 'coworking.delete',
      'spaces.view', 'spaces.create', 'spaces.edit', 'spaces.delete',
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
      'pages.view', 'pages.edit',
    ],
  },
  editor: {
    label: 'Editor',
    description: 'Creates and edits content. No deletes, no leads, no settings.',
    badge: 'bg-emerald-100 text-emerald-700',
    permissions: [
      'blog.view', 'blog.create', 'blog.edit',
      'articles.view', 'articles.create', 'articles.edit',
      'coworking.view', 'coworking.edit',
      'spaces.view', 'spaces.create', 'spaces.edit',
      'jobs.view', 'jobs.create', 'jobs.edit',
    ],
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access. Can look at content and leads but change nothing.',
    badge: 'bg-slate-100 text-slate-600',
    permissions: [
      'leads.view',
      'blog.view',
      'articles.view',
      'coworking.view',
      'spaces.view',
      'jobs.view',
      'pages.view',
    ],
  },
}

export const ROLE_KEYS = Object.keys(ROLE_PRESETS)

// ─── Checking helpers ──────────────────────────────────────────────────────

/**
 * Does this permission list satisfy `required`?
 * Honours the global "*" wildcard and per-section "blog.*" wildcards.
 */
export function hasPermission(permissions, required) {
  if (!required) return true
  const list = Array.isArray(permissions) ? permissions : []
  if (list.includes('*')) return true
  if (list.includes(required)) return true
  const section = required.split('.')[0]
  return list.includes(`${section}.*`)
}

/** True if any of the required permissions is granted. */
export function hasAnyPermission(permissions, requiredList = []) {
  if (!requiredList.length) return true
  return requiredList.some((p) => hasPermission(permissions, p))
}

/** Expand a role name into its preset permission array. */
export function permissionsForRole(role) {
  return ROLE_PRESETS[role]?.permissions ?? []
}

/**
 * Normalise whatever is stored in the DB into a string array.
 * Handles jsonb arrays, JSON strings and legacy nulls.
 */
export function parsePermissions(raw, role) {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      /* fall through to the role default */
    }
  }
  // Legacy rows created before this migration have no permissions —
  // fall back to whatever their role implies so nobody is locked out.
  return permissionsForRole(role)
}
