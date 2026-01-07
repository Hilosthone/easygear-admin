'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Store, Lock, Mail, ChevronRight } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'vendor'>('admin')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Capture the email to display a username in the sidebar later
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const namePart = email.split('@')[0]

    // Simulate auth delay
    setTimeout(() => {
      // 1. SAVE SESSION DATA (Critical for AdminGuard/VendorGuard)
      localStorage.setItem(
        'user_name',
        namePart.charAt(0).toUpperCase() + namePart.slice(1)
      )

      // Map 'admin' selection to 'System Root' to match your AdminGuard.tsx logic
      const sessionRole = role === 'admin' ? 'System Root' : 'Vendor'
      localStorage.setItem('user_role', sessionRole)

      // 2. REDIRECT
      router.push(`/${role}`)
    }, 1500)
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-xl'>
        {/* Logo Section */}
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-black italic tracking-tighter text-brand-slate'>
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
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all',
                role === 'admin'
                  ? 'bg-white text-brand-blue shadow-lg'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <ShieldCheck size={20} strokeWidth={3} />
              Admin
            </button>
            <button
              type='button'
              onClick={() => setRole('vendor')}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all',
                role === 'vendor'
                  ? 'bg-white text-brand-orange shadow-lg'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Store size={20} strokeWidth={3} />
              Vendor
            </button>
          </div>

          <form onSubmit={handleLogin} className='p-10 pt-4 space-y-6'>
            {/* Email Input */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2 transition-colors',
                    role === 'admin'
                      ? 'text-slate-400 group-focus-within:text-brand-blue'
                      : 'text-slate-400 group-focus-within:text-brand-orange'
                  )}
                  size={20}
                />
                <input
                  name='email'
                  type='email'
                  required
                  placeholder={
                    role === 'admin'
                      ? 'admin@easygear.com'
                      : 'store@easygear.com'
                  }
                  className={cn(
                    'w-full pl-14 pr-6 py-5 bg-slate-50 border-3 border-transparent rounded-2xl outline-none font-bold transition-all',
                    role === 'admin'
                      ? 'focus:border-brand-blue focus:bg-white'
                      : 'focus:border-brand-orange focus:bg-white'
                  )}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Secure Password
              </label>
              <div className='relative'>
                <Lock
                  className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400'
                  size={20}
                />
                <input
                  name='password'
                  type='password'
                  required
                  placeholder='••••••••'
                  className={cn(
                    'w-full pl-14 pr-6 py-5 bg-slate-50 border-3 border-transparent rounded-2xl outline-none font-bold transition-all',
                    role === 'admin'
                      ? 'focus:border-brand-blue focus:bg-white'
                      : 'focus:border-brand-orange focus:bg-white'
                  )}
                />
              </div>
            </div>

            {/* Dynamic Action Button */}
            <button
              disabled={loading}
              className={cn(
                'w-full py-6 rounded-3xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70',
                role === 'admin'
                  ? 'bg-brand-blue shadow-brand-blue/30 hover:bg-blue-700'
                  : 'bg-brand-orange shadow-brand-orange/30 hover:bg-orange-600'
              )}
            >
              {loading ? (
                <div className='w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin' />
              ) : (
                <>
                  <span>Enter {role === 'admin' ? 'Terminal' : 'Portal'}</span>
                  <ChevronRight size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className='p-8 bg-slate-50 border-t-2 border-slate-100 text-center'>
            <p className='text-xs font-bold text-slate-400'>
              Forgot access credentials?{' '}
              <span
                className={cn(
                  'cursor-pointer transition-colors',
                  role === 'admin'
                    ? 'text-brand-blue hover:text-blue-700'
                    : 'text-brand-orange hover:text-orange-600'
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