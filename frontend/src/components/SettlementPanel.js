import { useState } from 'react'
import { ArrowRight, Info, TrendingUp, TrendingDown, Target, CheckCircle2, Loader2, ShieldCheck, X, UserCheck, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function SettlementPanel({ summary, onRefresh }) {
  const supabase = createClient()
  const [settlingIdx, setSettlingIdx] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeSettlement, setActiveSettlement] = useState(null)
  const [confirmingPartner, setConfirmingPartner] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [authError, setAuthError] = useState(null)

  if (!summary) return null

  const { partnerBalances, settlements } = summary

  const openConfirmModal = (s, idx) => {
    setActiveSettlement({ ...s, idx })
    setShowModal(true)
    setConfirmingPartner('')
    setEmail(s.toEmail || '')
    setPassword('')
    setAuthError(null)
  }

  const handleSettle = async (e) => {
    if (e) e.preventDefault()
    
    if (!email || !password) {
        setAuthError('Please enter your email and security key.')
        return
    }

    setIsVerifying(true)
    setAuthError(null)

    try {
      // Verify credentials against Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setAuthError('Authentication failed. Please check your credentials.')
        setIsVerifying(false)
        return
      }

      // If successful, proceed with settlement
      const s = activeSettlement
      const idx = s.idx
      
      const date = new Date().toISOString().split('T')[0]
      
      // 1. Create expense for the debtor (positive amount)
      const res1 = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Settlement: Paid to ${s.to}`,
          amount: s.amount,
          partner_id: s.fromId,
          category: 'Settlement',
          date: date,
          note: `Authenticated by ${email}. Direct settlement transfer to ${s.to}`
        })
      })

      // 2. Create offsetting "negative expense" for the beneficiary (negative amount)
      const res2 = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Settlement: Received from ${s.from}`,
          amount: -s.amount,
          partner_id: s.toId,
          category: 'Settlement',
          date: date,
          note: `Authenticated by ${email}. Direct settlement transfer from ${s.from}`
        })
      })

      if (res1.ok && res2.ok) {
        setShowModal(false)
        if (onRefresh) await onRefresh()
      } else {
        alert('Failed to record settlement. Please try again.')
      }
    } catch (error) {
      console.error('Settlement error', error)
      alert('An error occurred during verification.')
    } finally {
      setIsVerifying(false)
      setSettlingIdx(null)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Individual Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partnerBalances.map((partner) => {
          const isNegative = partner.balance < 0
          return (
            <div key={partner.id} className="bg-(--card) border border-(--border) rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              {/* Background Accent */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isNegative ? 'bg-destructive' : 'bg-accent'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-(--muted-foreground) text-[10px] font-black uppercase tracking-[0.2em]">{partner.name}</h4>
                {isNegative ? (
                  <TrendingDown className="text-destructive" size={18} />
                ) : (
                  <TrendingUp className="text-accent" size={18} />
                )}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-(--muted-foreground) block uppercase font-black tracking-widest mb-1 opacity-60">Paid</span>
                  <span className="text-xl font-black text-(--foreground) tracking-tight">₹{partner.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-(--muted-foreground) block uppercase font-black tracking-widest mb-1 opacity-60">Balance</span>
                  <span className={`text-xl font-black tracking-tight ${isNegative ? 'text-destructive' : 'text-accent'}`}>
                    {isNegative ? '-' : '+'}₹{Math.abs(partner.balance).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar Label */}
              <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-(--muted-foreground) mb-2">
                <span>Contribution Share</span>
                <span>{partner.percentage.toFixed(1)}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-(--background) border border-(--border) rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isNegative ? 'bg-destructive' : 'bg-accent'}`}
                  style={{ width: `${Math.min(Math.max(partner.percentage, 2), 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Settlements */}
      <div className="bg-(--card) text-(--foreground) rounded-4xl p-8 shadow-2xl border border-(--border) relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-3 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--muted-foreground) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-2xl text-accent shadow-[0_0_15px_rgba(5,150,105,0.15)]">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight italic uppercase">Settlement Optimization</h3>
              <p className="text-sm text-(--muted-foreground) font-medium">Minimum transactions required to balance the books</p>
            </div>
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-12 bg-(--background)/50 border border-dashed border-(--border) rounded-2xl">
            <p className="text-(--muted-foreground) italic font-bold">Perfect Balance! All accounts are currently settled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 relative">
            {settlements.map((s, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row items-center justify-between bg-(--background) border border-(--border) rounded-2xl p-6 transition-all hover:border-accent group">
                <div className="flex flex-col items-center md:items-start mb-4 lg:mb-0">
                  <span className="text-[10px] text-destructive uppercase font-black tracking-[0.2em] mb-2 flex items-center gap-2">
                    <TrendingDown size={12} /> Debtor
                  </span>
                  <span className="text-xl font-black text-center md:text-left">{s.from}</span>
                </div>
                
                <div className="flex flex-col items-center flex-1 mx-8 mb-4 lg:mb-0">
                  <div className="bg-accent/10 text-accent px-6 py-2 rounded-full text-xl font-black tracking-tight border border-accent/20 mb-3 shadow-[0_5px_15px_rgba(5,150,105,0.1)]">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-3 text-(--border) group-hover:text-accent transition-colors">
                    <div className="h-px w-12 bg-current opacity-30"></div>
                    <ArrowRight size={20} className="animate-pulse" />
                    <div className="h-px w-12 bg-current opacity-30"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right mb-6 lg:mb-0">
                  <span className="text-[10px] text-accent uppercase font-black tracking-[0.2em] mb-2 flex items-center justify-center md:justify-end gap-2">
                    <TrendingUp size={12} /> Beneficiary
                  </span>
                  <span className="text-xl font-black">{s.to}</span>
                </div>

                <div className="lg:ml-8">
                  <button 
                    onClick={() => openConfirmModal(s, idx)}
                    disabled={settlingIdx !== null}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-accent/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
                  >
                    {settlingIdx === idx ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Confirm Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex items-center gap-3 text-(--muted-foreground) bg-(--background)/30 p-4 rounded-xl border border-(--border)">
          <Info size={18} className="text-accent" />
          <p className="text-xs font-medium leading-relaxed">
            This plan uses a greedy algorithm to minimize the number of transactions between partners. Confirming a payment will record a balancing transaction.
          </p>
        </div>
      </div>

      {/* Security Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
            
            <div className="bg-(--card) border border-(--border) w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight text-(--foreground)">Auth Required</h3>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-(--accent) rounded-xl text-(--muted-foreground) transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSettle} className="space-y-8">
                    <div className="bg-(--background) border border-(--border) rounded-3xl p-6 text-center space-y-4">
                        <div className="flex items-center justify-center gap-4 text-xl font-black tracking-tight">
                            <span className="text-(--muted-foreground)">{activeSettlement?.from}</span>
                            <ArrowRight size={20} className="text-accent" />
                            <span className="text-(--foreground)">{activeSettlement?.to}</span>
                        </div>
                        <div className="text-3xl font-black text-accent tracking-tighter italic">
                            ₹{activeSettlement?.amount.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                <Mail size={14} className="text-accent" /> Beneficiary Email
                            </label>
                            <input 
                                type="email"
                                required
                                readOnly={!!activeSettlement?.toEmail}
                                placeholder="name@grandgrey.com"
                                className={`w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold ${activeSettlement?.toEmail ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                <KeyRound size={14} className="text-accent" /> Security Password
                            </label>
                            <input 
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold tracking-widest"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {authError && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold p-4 rounded-xl flex items-center gap-2 animate-shake">
                            <AlertCircle size={14} />
                            {authError}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-accent/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {isVerifying ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Lock size={18} />
                                Verify & Settle
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-[10px] text-(--muted-foreground) font-bold uppercase tracking-widest opacity-50">
                        {activeSettlement?.to} must authorize this receipt
                    </p>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}
