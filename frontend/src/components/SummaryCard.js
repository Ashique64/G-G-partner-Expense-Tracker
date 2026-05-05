export default function SummaryCard({ title, amount, subtitle, colorClass = "text-(--foreground)" }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-(--muted-foreground)/30 group">
      <h3 className="text-(--muted-foreground) text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
      <div className={`text-3xl font-black tracking-tight ${colorClass}`}>
        ₹{Number(amount).toLocaleString('en-IN')}
      </div>
      {subtitle && <p className="text-(--muted-foreground) text-xs mt-2 font-medium opacity-70">{subtitle}</p>}
      
      {/* Subtle bottom accent line */}
      <div className="mt-4 h-1 w-8 bg-accent rounded-full transition-all group-hover:w-full opacity-30"></div>
    </div>
  )
}
