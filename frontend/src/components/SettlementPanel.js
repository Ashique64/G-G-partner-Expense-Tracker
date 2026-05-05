import { ArrowRight, Info, TrendingUp, TrendingDown, Target } from 'lucide-react'

export default function SettlementPanel({ summary }) {
  if (!summary) return null

  const { partnerBalances, settlements } = summary

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
        
        <div className="flex items-center gap-3 mb-8 relative">
          <div className="p-3 bg-accent/20 rounded-2xl text-accent shadow-[0_0_15px_rgba(5,150,105,0.15)]">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight italic uppercase">Settlement Optimization</h3>
            <p className="text-sm text-(--muted-foreground) font-medium">Minimum transactions required to balance the books</p>
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-12 bg-(--background)/50 border border-dashed border-(--border) rounded-2xl">
            <p className="text-(--muted-foreground) italic font-bold">Perfect Balance! All accounts are currently settled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 relative">
            {settlements.map((s, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between bg-(--background) border border-(--border) rounded-2xl p-6 transition-all hover:border-accent group">
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="text-[10px] text-destructive uppercase font-black tracking-[0.2em] mb-2 flex items-center gap-2">
                    <TrendingDown size={12} /> Debtor
                  </span>
                  <span className="text-xl font-black">{s.from}</span>
                </div>
                
                <div className="flex flex-col items-center flex-1 mx-8 mb-4 md:mb-0">
                  <div className="bg-accent/10 text-accent px-6 py-2 rounded-full text-xl font-black tracking-tight border border-accent/20 mb-3 shadow-[0_5px_15px_rgba(5,150,105,0.1)]">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-3 text-(--border) group-hover:text-accent transition-colors">
                    <div className="h-px w-12 bg-current opacity-30"></div>
                    <ArrowRight size={20} className="animate-pulse" />
                    <div className="h-px w-12 bg-current opacity-30"></div>
                  </div>
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-accent uppercase font-black tracking-[0.2em] mb-2 flex items-center justify-end gap-2">
                    <TrendingUp size={12} /> Beneficiary
                  </span>
                  <span className="text-xl font-black">{s.to}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex items-center gap-3 text-(--muted-foreground) bg-(--background)/30 p-4 rounded-xl border border-(--border)">
          <Info size={18} className="text-accent" />
          <p className="text-xs font-medium leading-relaxed">
            This plan uses a greedy algorithm to minimize the number of transactions between partners. Please confirm payments once transferred.
          </p>
        </div>
      </div>
    </div>
  )
}
