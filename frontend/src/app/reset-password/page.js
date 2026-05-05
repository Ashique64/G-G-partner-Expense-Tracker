'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-(--card) border border-(--border) rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 bg-accent rounded-2xl items-center justify-center shadow-lg mb-6">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">New Password</h1>
          <p className="text-sm text-(--muted-foreground) mt-2 font-medium">Set your new security key for Grand & Grey</p>
        </div>

        {success ? (
          <div className="bg-accent/10 border border-accent/20 text-accent p-6 rounded-2xl text-center space-y-4 animate-in zoom-in-95">
            <CheckCircle2 size={48} className="mx-auto" />
            <div className="font-black uppercase tracking-widest text-sm">Password Updated!</div>
            <p className="text-xs opacity-80">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest ml-1">Confirm Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold tracking-widest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold p-4 rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : <><Save size={20} className="inline mr-2" /> Update Password</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
