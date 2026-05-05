'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--background) p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--muted-foreground) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 bg-accent rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.3)] mb-6">
            <span className="text-white font-black text-2xl tracking-tighter">G&G</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-(--foreground) uppercase italic">Internal Access</h1>
          <p className="text-(--muted-foreground) mt-2 font-medium tracking-wide">Grand & Grey &mdash; Partner Expense Tracker</p>
        </div>

        <form onSubmit={handleLogin} className="bg-(--card) border border-(--border) rounded-4xl p-10 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2">
              <Mail size={14} /> Partner Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold placeholder:text-(--muted-foreground)/30"
              placeholder="name@grandgrey.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={14} /> Security Key
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 pr-14 outline-none focus:border-accent text-(--foreground) transition-all font-bold tracking-widest placeholder:text-(--muted-foreground)/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-(--muted-foreground) hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-2xl py-5 font-black text-lg shadow-[0_10px_30px_rgba(5,150,105,0.15)] hover:shadow-[0_15px_40px_rgba(5,150,105,0.2)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                Authenticate
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] text-(--muted-foreground) uppercase font-black tracking-widest opacity-50">
          Authorized Personnel Only &bull; Secured by Supabase Auth
        </p>
      </div>
    </div>
  )
}
