'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Store,
  Lock,
  Mail,
  ChevronRight,
  User,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'vendor'>('admin')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const username = formData.get('username') as string

    // Simulate auth delay
    setTimeout(() => {
      // 1. FORMAT DATA FOR SIDEBAR & GUARDS
      const userData = {
        name: username || (role === 'admin' ? 'System Admin' : 'Gear Vendor'),
        email: email,
        role: role === 'admin' ? 'System Root' : 'Vendor',
      }

      // 2. CLEAR PREVIOUS & SET NEW SESSION
      localStorage.clear()
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('user_role', userData.role)
      localStorage.setItem('user_name', userData.name) // Secondary fallback

      // 3. REDIRECT BASED ON ROLE
      // If role is admin, go to /admin. If vendor, go to /vendor
      router.push(`/${role}`)

      // Force a refresh if the guard is being stubborn
      router.refresh()
    }, 1500)
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans'>
      <div className='w-full max-w-xl'>
        {/* Logo Section */}
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-black italic tracking-tighter text-brand-slate uppercase'>
            easyGear<span className='text-brand-orange'>.</span>
          </h1>
          <p className='text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs'>
            Terminal Access Control
          </p>
        </div>

        <div className='bg-white rounded-5xl border-4 border-white shadow-2xl overflow-hidden'>
          {/* Role Selector Tabs */}
          <div className='flex p-2 bg-slate-100/50 m-6 rounded-3xl'>
            <button
              type='button'
              onClick={() => setRole('admin')}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all',
                role === 'admin'
                  ? 'bg-white text-brand-blue shadow-lg'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <ShieldCheck size={18} strokeWidth={3} /> Admin
            </button>
            <button
              type='button'
              onClick={() => setRole('vendor')}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all',
                role === 'vendor'
                  ? 'bg-white text-brand-orange shadow-lg'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Store size={18} strokeWidth={3} /> Vendor
            </button>
          </div>

          <form onSubmit={handleLogin} className='p-10 pt-4 space-y-5'>
            {/* Username Input */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Identity Name
              </label>
              <div className='relative group'>
                <User
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2 transition-colors',
                    role === 'admin'
                      ? 'text-slate-300 group-focus-within:text-brand-blue'
                      : 'text-slate-300 group-focus-within:text-brand-orange'
                  )}
                  size={20}
                />
                <input
                  name='username'
                  type='text'
                  required
                  placeholder='e.g. John Doe'
                  className={cn(
                    'w-full pl-14 pr-6 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm transition-all',
                    role === 'admin'
                      ? 'focus:border-brand-blue/10 focus:bg-white focus:ring-4 focus:ring-brand-blue/5'
                      : 'focus:border-brand-orange/10 focus:bg-white focus:ring-4 focus:ring-brand-orange/5'
                  )}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Email Address
              </label>
              <div className='relative group'>
                <Mail
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2 transition-colors',
                    role === 'admin'
                      ? 'text-slate-300 group-focus-within:text-brand-blue'
                      : 'text-slate-300 group-focus-within:text-brand-orange'
                  )}
                  size={20}
                />
                <input
                  name='email'
                  type='email'
                  required
                  placeholder='name@company.com'
                  className={cn(
                    'w-full pl-14 pr-6 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm transition-all',
                    role === 'admin'
                      ? 'focus:border-brand-blue/10 focus:bg-white focus:ring-4 focus:ring-brand-blue/5'
                      : 'focus:border-brand-orange/10 focus:bg-white focus:ring-4 focus:ring-brand-orange/5'
                  )}
                />
              </div>
            </div>

            {/* Password Input with Eye Toggle */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Secure Password
              </label>
              <div className='relative group'>
                <Lock
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2 transition-colors',
                    role === 'admin'
                      ? 'text-slate-300 group-focus-within:text-brand-blue'
                      : 'text-slate-300 group-focus-within:text-brand-orange'
                  )}
                  size={20}
                />
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder='••••••••'
                  className={cn(
                    'w-full pl-14 pr-14 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm transition-all',
                    role === 'admin'
                      ? 'focus:border-brand-blue/10 focus:bg-white focus:ring-4 focus:ring-brand-blue/5'
                      : 'focus:border-brand-orange/10 focus:bg-white focus:ring-4 focus:ring-brand-orange/5'
                  )}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Dynamic Action Button */}
            <button
              disabled={loading}
              className={cn(
                'w-full py-6 rounded-4xl font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 mt-4',
                role === 'admin'
                  ? 'bg-brand-blue shadow-brand-blue/20 hover:bg-blue-700'
                  : 'bg-brand-orange shadow-brand-orange/20 hover:bg-orange-600'
              )}
            >
              {loading ? (
                <div className='w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin' />
              ) : (
                <>
                  <span>
                    Initialize {role === 'admin' ? 'Terminal' : 'Portal'}
                  </span>
                  <ChevronRight size={18} strokeWidth={4} />
                </>
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className='p-8 bg-slate-50/50 border-t-2 border-slate-100 text-center'>
            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Access Issues?{' '}
              <span
                className={cn(
                  'cursor-pointer transition-colors',
                  role === 'admin'
                    ? 'text-brand-blue hover:underline'
                    : 'text-brand-orange hover:underline'
                )}
              >
                Contact System IT
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}