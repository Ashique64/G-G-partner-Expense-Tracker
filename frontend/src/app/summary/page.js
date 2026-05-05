'use client'

import { useState, useEffect } from 'react'
import SettlementPanel from '@/components/SettlementPanel'
import { Loader2, PieChart } from 'lucide-react'

export default function SummaryPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchSummary() {
    try {
      const res = await fetch('/api/summary')
      const data = await res.json()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch summary', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={40} />
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Summary & Settlements</h1>
        <p className="text-gray-500">How things stand and how to settle up.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SettlementPanel summary={summary} onRefresh={fetchSummary} />
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-(--card) border border-(--border) rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent rounded-full blur-3xl opacity-5 transition-opacity group-hover:opacity-10"></div>
            
            <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <PieChart size={16} />
              </div>
              Quick Stats
            </h3>
            
            <div className="space-y-8 relative">
              <div className="flex flex-col">
                <span className="text-[10px] text-(--muted-foreground) uppercase font-black tracking-widest mb-2 opacity-60">Total Project Spend</span>
                <span className="text-3xl font-black text-(--foreground) tracking-tight italic">₹{summary?.totalSpend.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-8 border-t border-(--border) flex flex-col">
                <span className="text-[10px] text-(--muted-foreground) uppercase font-black tracking-widest mb-2 opacity-60">Equal Share (per partner)</span>
                <span className="text-2xl font-black text-(--foreground) tracking-tight italic">₹{summary?.equalShare.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-3xl p-8 text-(--foreground) relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl">💡</span>
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-accent">
              Settlement Tip
            </h4>
            <p className="text-sm font-medium leading-relaxed opacity-90 relative z-10">
              Positive balances mean you've paid more than your share and are owed money. Negative balances mean you've paid less and need to contribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
