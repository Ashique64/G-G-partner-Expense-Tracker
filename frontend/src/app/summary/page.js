'use client'

import { useState, useEffect } from 'react'
import SettlementPanel from '@/components/SettlementPanel'
import { Loader2, PieChart } from 'lucide-react'

export default function SummaryPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
          <SettlementPanel summary={summary} />
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PieChart size={16} />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">Total Project Spend</span>
                <span className="text-2xl font-bold">₹{summary?.totalSpend.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t">
                <span className="text-xs text-gray-400 block uppercase font-medium">Equal Share (per partner)</span>
                <span className="text-xl font-bold text-gray-700">₹{summary?.equalShare.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Settlement Tip
            </h4>
            <p className="text-sm leading-relaxed opacity-80">
              Positive balances mean you've paid more than your share and are owed money. Negative balances mean you've paid less and need to contribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
