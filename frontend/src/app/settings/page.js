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
    <div className="max-w-2xl mx-auto flex flex-col gap-10 animate-fade-in py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-(--foreground) mb-2">Partner Settings</h1>
          <p className="text-(--muted-foreground) font-medium">Manage and update business partner identities</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 text-accent bg-accent/10 border border-accent/20 px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={16} />
            Updated
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-(--card) border border-(--border) rounded-3xl p-6 shadow-2xl flex items-center gap-6 group hover:border-accent transition-all">
            <div className="h-16 w-16 bg-(--background) border border-(--border) rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-inner">
              <User size={32} />
            </div>
            
            <div className="flex-1">
              <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] mb-2 block opacity-70">
                Partner Name
              </label>
              <input
                type="text"
                className="w-full text-2xl font-black text-(--foreground) bg-transparent outline-none border-b-2 border-transparent focus:border-accent pb-1 transition-all"
                value={partner.name}
                onChange={(e) => handleNameChange(partner.id, e.target.value)}
              />
            </div>

            <button
              onClick={() => savePartner(partner)}
              disabled={savingId === partner.id}
              className="h-14 px-6 bg-accent text-white rounded-2xl font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:translate-y-0"
            >
              {savingId === partner.id ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span className="hidden md:inline">Save</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-accent/5 border border-dashed border-accent/20 rounded-4xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <User size={120} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest text-accent mb-3">Scaling the Team?</h3>
        <p className="text-sm text-(--muted-foreground) leading-relaxed font-medium max-w-lg">
          The current financial logic is precision-engineered for a 3-partner model. If you need to add more partners or change the sharing ratios, please contact system administration.
        </p>
      </div>
    </div>
  )
}
