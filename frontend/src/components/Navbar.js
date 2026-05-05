'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Receipt, BarChart3, Settings, Menu, X, Sun, Moon, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Summary', href: '/summary', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Navbar() {
  const supabase = createClient()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (pathname === '/login') return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="h-9 w-9 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.2)]">
              <span className="text-white font-black text-xs tracking-tighter">G&G</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight uppercase text-(--foreground)">Grand & Grey</span>
              <span className="text-[10px] text-(--muted-foreground) font-bold uppercase tracking-widest">Partner Tracker</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-(--primary) text-(--primary-foreground) shadow-lg' 
                      : 'text-(--muted-foreground) hover:bg-(--accent) hover:text-(--foreground)'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            <div className="h-6 w-px bg-(--border) mx-4"></div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-(--muted-foreground) hover:bg-(--accent) hover:text-(--foreground) transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-(--muted-foreground) hover:text-destructive hover:bg-destructive/10 transition-all"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-(--muted-foreground) hover:bg-(--accent)"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-(--muted-foreground) hover:text-destructive"
            >
              <LogOut size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-(--muted-foreground) hover:bg-(--accent) transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-(--border) bg-(--background) animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold transition-all ${
                    isActive 
                      ? 'bg-(--primary) text-(--primary-foreground) shadow-lg' 
                      : 'text-(--muted-foreground) hover:bg-(--accent) hover:text-(--foreground)'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-(--muted-foreground) uppercase font-black tracking-widest">
              Business Expense Sharing v2.0
            </p>
          </div>
        </div>
      )}
    </nav>
  )
}
