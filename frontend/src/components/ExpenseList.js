'use client'

import { useState, useEffect } from 'react'
import { Trash2, Filter, Loader2, Search, Pencil, X, Save, Calendar, FileText, IndianRupee, Tag } from 'lucide-react'

export default function ExpenseList({ expenses, loading, onDelete, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [partnerFilter, setPartnerFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setAllCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }
    fetchCategories()
  }, [])

  const uniquePartners = [...new Set(expenses.map(e => e.partners?.name))].filter(Boolean)
  const uniqueCategories = [...new Set(expenses.map(e => e.category))]

  const filteredExpenses = expenses.filter(e => {
    const matchesPartner = partnerFilter === 'all' || e.partners?.name === partnerFilter
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter
    const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (e.note && e.note.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Exact Date Filtering
    const matchesDate = !dateFilter || e.date === dateFilter
    
    return matchesPartner && matchesCategory && matchesSearch && matchesDate
  })

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    
    // Create a clean object with only the columns that exist in the database
    const updateData = {
      description: editingExpense.description,
      amount: Number(editingExpense.amount),
      category: editingExpense.category,
      note: editingExpense.note,
      date: editingExpense.date,
      partner_id: editingExpense.partner_id
    }

    try {
      const res = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      if (res.ok) {
        if (onUpdate) onUpdate()
        setEditingExpense(null)
      } else {
        const err = await res.json()
        alert(`Update failed: ${err.error}`)
      }
    } catch (error) {
      console.error('Failed to update', error)
      alert('Failed to connect to the server')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Search & Filter Bar */}
      <div className="bg-(--card) border border-(--border) rounded-3xl p-4 md:p-6 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted-foreground) group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search transactions..."
              className="w-full bg-(--background) border border-(--border) rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-accent text-(--foreground) font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-(--muted-foreground) px-2">
              <Filter size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Filter</span>
            </div>
            
            <select 
              className="flex-1 md:flex-none bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-accent text-(--foreground) appearance-none cursor-pointer"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
            >
              <option value="all">All Partners</option>
              {uniquePartners.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select 
              className="flex-1 md:flex-none bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-accent text-(--foreground) appearance-none cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex-1 md:flex-none flex items-center gap-3 bg-(--background) border border-(--border) rounded-xl px-4 py-2 text-sm font-bold text-(--foreground)">
              <Calendar size={16} className="text-accent" />
              <input 
                type="date" 
                className="bg-transparent outline-none cursor-pointer w-full"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} className="hover:text-accent transition-colors p-1"><X size={16} /></button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-2xl px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] text-accent uppercase font-black tracking-[0.2em] opacity-70">Total in View</span>
          <span className="text-2xl font-black text-(--foreground) tracking-tight">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Expenses Display */}
      <div className="flex flex-col gap-4">
        {filteredExpenses.length === 0 ? (
          <div className="bg-(--card) border border-(--border) rounded-3xl p-20 text-center text-(--muted-foreground) italic font-medium">
            No transactions found matching your criteria.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden bg-(--card) border border-(--border) rounded-3xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-(--border) bg-(--background)/50">
                      <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em]">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em]">Details</th>
                      <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em]">Category</th>
                      <th className="px-8 py-5 text-[10px) font-black text-(--muted-foreground) uppercase tracking-[0.2em]">Partner</th>
                      <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] text-right">Amount</th>
                      <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--border)">
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-accent/3 transition-colors group">
                        <td className="px-8 py-5 text-sm text-(--muted-foreground) font-bold whitespace-nowrap">
                          {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-base font-black text-(--foreground) tracking-tight">{expense.description}</div>
                          {expense.note && <div className="text-xs text-(--muted-foreground) mt-1 font-medium opacity-60">{expense.note}</div>}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-(--background) border border-(--border) text-(--foreground)">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-(--background) border border-(--border) flex items-center justify-center text-[10px] font-black">
                              {expense.partners?.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm font-bold text-(--foreground)">{expense.partners?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-lg font-black text-(--foreground) text-right tracking-tight">₹{Number(expense.amount).toLocaleString('en-IN')}</td>
                        <td className="px-8 py-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setEditingExpense(expense)} className="p-2 text-(--muted-foreground) hover:text-accent hover:bg-accent/10 rounded-xl transition-all"><Pencil size={18} /></button>
                            <button onClick={() => onDelete(expense.id)} className="p-2 text-(--muted-foreground) hover:text-red-500 hover:bg-red-500/20 rounded-xl transition-all shadow-sm hover:shadow-red-500/10"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="bg-(--card) border border-(--border) rounded-3xl p-5 shadow-lg relative group active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-black italic">
                        {expense.partners?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-(--foreground) tracking-tight">{expense.description}</div>
                        <div className="text-[10px] text-(--muted-foreground) font-bold uppercase tracking-widest">{new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-(--foreground) tracking-tight">₹{Number(expense.amount).toLocaleString('en-IN')}</div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-(--background) border border-(--border) text-(--muted-foreground)">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                  
                  {expense.note && <div className="text-xs text-(--muted-foreground) mb-4 bg-(--background)/50 p-3 rounded-xl italic font-medium">{expense.note}</div>}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-(--border)">
                    <button onClick={() => setEditingExpense(expense)} className="flex-1 py-2.5 bg-accent/5 hover:bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-accent/10"><Pencil size={14} /> Edit</button>
                    <button onClick={() => onDelete(expense.id)} className="flex-1 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-red-500/10"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingExpense(null)}></div>
          <div className="bg-(--card) border border-(--border) w-full max-w-lg rounded-4xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-(--foreground)">Edit Transaction</h3>
              <button onClick={() => setEditingExpense(null)} className="p-2 hover:bg-(--accent) rounded-xl text-(--muted-foreground)">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-accent" /> Description
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-(--background) border border-(--border) rounded-2xl px-4 py-3 font-bold text-(--foreground)"
                    value={editingExpense.description}
                    onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-2 flex items-center gap-2">
                    <IndianRupee size={14} className="text-accent" /> Amount (₹)
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-(--background) border border-(--border) rounded-2xl px-4 py-3 font-black text-xl text-(--foreground)"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({...editingExpense, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Tag size={14} className="text-accent" /> Category
                  </label>
                  <select 
                    className="w-full bg-(--background) border border-(--border) rounded-2xl px-4 py-3 font-bold text-(--foreground) appearance-none cursor-pointer"
                    value={editingExpense.category}
                    onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                  >
                    {allCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-accent" /> Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full bg-(--background) border border-(--border) rounded-2xl px-4 py-3 font-bold text-(--foreground)"
                    value={editingExpense.date}
                    onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-accent" /> Note
                  </label>
                  <textarea 
                    className="w-full bg-(--background) border border-(--border) rounded-2xl px-4 py-3 font-medium text-(--foreground)"
                    value={editingExpense.note || ''}
                    onChange={(e) => setEditingExpense({...editingExpense, note: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUpdating}
                className="w-full bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all"
              >
                {isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
