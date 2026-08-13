import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminClient } from '../../lib/supabaseAdmin'
import AdminNav from '../../components/admin/AdminNav'

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const adminClient = getAdminClient()

  useEffect(() => {
    if (!adminClient) { navigate('/admin'); return }
    adminClient
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setLeads(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav active="leads" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Leads ({leads.length})</h1>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="text-slate-500">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-600">City</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Interest</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Source</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Message</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                    <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-blue-600">{l.phone}</a></td>
                    <td className="px-4 py-3">{l.email || '-'}</td>
                    <td className="px-4 py-3">{l.city || '-'}</td>
                    <td className="px-4 py-3">{l.interest || '-'}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{l.source}</span></td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{l.message || '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(l.created_at).toLocaleString('en-IN', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
