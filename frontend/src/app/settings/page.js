'use client'

import { useState, useEffect } from 'react'
import { Save, User, Loader2, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners')
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error('Failed to fetch partners', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (id, newName) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p))
  }

  const savePartner = async (partner) => {
    setSavingId(partner.id)
    try {
      const res = await fetch(`/api/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: partner.name })
      })

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert('Failed to save partner name')
      }
    } catch (error) {
      console.error('Save error', error)
    } finally {
      setSavingId(null)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={40} />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Partner Settings</h1>
          <p className="text-gray-500">Update the names of the business partners.</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            Changes saved
          </div>
        )}
      </div>

      <div className="space-y-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white border rounded-xl p-6 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <User size={24} />
            </div>
            
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                Partner Name
              </label>
              <input
                type="text"
                className="w-full text-lg font-bold outline-none focus:text-black border-b border-transparent focus:border-gray-200 pb-1"
                value={partner.name}
                onChange={(e) => handleNameChange(partner.id, e.target.value)}
              />
            </div>

            <button
              onClick={() => savePartner(partner)}
              disabled={savingId === partner.id}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
            >
              {savingId === partner.id ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 border rounded-xl border-dashed">
        <h3 className="font-bold mb-2">Adding more partners?</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          The current version is optimized for a 3-partner profit/expense sharing model. Contact support if you need to scale the team.
        </p>
      </div>
    </div>
  )
}
