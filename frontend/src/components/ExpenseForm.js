'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, Loader2, IndianRupee, Tag, User, Calendar, FileText } from 'lucide-react'

export default function ExpenseForm({ onExpenseAdded }) {
  const [partners, setPartners] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingPartners, setFetchingPartners] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    partner_id: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [partnersRes, categoriesRes] = await Promise.all([
          fetch('/api/partners'),
          fetch('/api/categories')
        ])
        const partnersData = await partnersRes.json()
        const categoriesData = await categoriesRes.json()
        
        setPartners(partnersData)
        setCategories(categoriesData)
        
        if (partnersData.length > 0) {
          setFormData(prev => ({ ...prev, partner_id: partnersData[0].id }))
        }
        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, category: categoriesData[0].name }))
        }
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setFetchingPartners(false)
      }
    }
    fetchData()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      })
      if (res.ok) {
        const newCat = await res.json()
        setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)))
        setFormData(prev => ({ ...prev, category: newCat.name }))
        setNewCategoryName('')
        setShowAddCategory(false)
      }
    } catch (error) {
      console.error('Failed to add category', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({
          ...formData,
          description: '',
          amount: '',
          note: ''
        })
        if (onExpenseAdded) onExpenseAdded()
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to add expense', error)
      alert('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingPartners) return (
    <div className="p-12 border border-(--border) rounded-3xl bg-(--card) flex items-center justify-center">
      <Loader2 className="animate-spin text-(--muted-foreground)" />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-(--card) border border-(--border) rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-accent/20 rounded-lg text-accent">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-(--foreground) tracking-tight">Add Expense</h2>
          <p className="text-sm text-(--muted-foreground) font-medium">Record a new business transaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-accent" /> Description
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Fabric Sourcing"
            className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-bold placeholder:text-(--muted-foreground)/50"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
            <IndianRupee size={14} className="text-accent" /> Amount (₹)
          </label>
          <input
            type="number"
            required
            placeholder="0.00"
            className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-black text-xl placeholder:text-(--muted-foreground)/50"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        {/* Paid By */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-accent" /> Paid By
          </label>
          <select
            className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-bold appearance-none cursor-pointer"
            value={formData.partner_id}
            onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
          >
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-accent" /> Category
            </label>
            <button 
              type="button" 
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-[10px] font-black uppercase text-accent hover:underline"
            >
              {showAddCategory ? 'Cancel' : '+ New Category'}
            </button>
          </div>
          
          {showAddCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name"
                className="flex-1 bg-(--background) border border-(--border) rounded-xl px-4 py-2 outline-none focus:border-accent text-(--foreground) font-bold text-sm"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-accent text-white px-4 rounded-xl font-bold text-sm"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-bold appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} className="text-accent" /> Date
          </label>
          <input
            type="date"
            required
            className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-bold"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-(--muted-foreground) uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-accent" /> Note (Optional)
          </label>
          <input
            type="text"
            placeholder="Add extra details..."
            className="bg-(--background) border border-(--border) rounded-xl px-4 py-3 outline-none focus:border-accent text-(--foreground) transition-all font-medium placeholder:text-(--muted-foreground)/50"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-accent text-white rounded-2xl py-4 sm:py-5 font-black text-base sm:text-lg shadow-[0_10px_30px_rgba(5,150,105,0.15)] hover:shadow-[0_15px_40px_rgba(5,150,105,0.2)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 uppercase tracking-widest px-4"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : (
          <>
            <PlusCircle size={22} className="shrink-0" />
            <span className="truncate">Secure Transaction</span>
          </>
        )}
      </button>
    </form>
  )
}
