'use client'

import { useState, useEffect } from 'react'
import ExpenseList from '@/components/ExpenseList'
import { Receipt } from 'lucide-react'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/expenses')
      const data = await res.json()
      setExpenses(data)
    } catch (error) {
      console.error('Failed to fetch expenses', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchExpenses()
      } else {
        alert('Failed to delete expense')
      }
    } catch (error) {
      console.error('Delete error', error)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic text-(--foreground)">All Expenses</h1>
          <p className="text-(--muted-foreground) font-medium mt-1">Full transaction ledger and history</p>
        </div>
        
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 flex items-center gap-5 shadow-xl group hover:border-accent/30 transition-all">
          <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Receipt size={24} />
          </div>
          <div>
            <span className="text-[10px] text-(--muted-foreground) uppercase font-black tracking-[0.2em] block mb-1">Total Entries</span>
            <span className="text-2xl font-black text-(--foreground) tracking-tight">{expenses.length}</span>
          </div>
        </div>
      </div>

      <ExpenseList 
        expenses={expenses} 
        loading={loading} 
        onDelete={handleDelete} 
        onUpdate={fetchExpenses}
      />
    </div>
  )
}
