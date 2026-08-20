/**
 * Reusable loading skeleton for admin table pages.
 * Shows animated shimmer rows that mimic a table layout.
 */
export default function AdminTableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
        >
          {[...Array(cols)].map((_, j) => (
            <div
              key={j}
              className={`h-4 animate-pulse rounded bg-slate-200 ${
                j === 0 ? 'w-40' : j === 1 ? 'w-28' : j === 2 ? 'w-20' : 'w-16'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
