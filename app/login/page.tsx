'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Store,
  Lock,
  Mail,
  ChevronRight,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'vendor'>('admin')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'error' | 'success'
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // --- ADMIN BYPASS LOGIC ---
    // If logging in as admin with your specific credentials, skip the API call.
    if (
      role === 'admin' &&
      email === 'admin@easygear.ng' &&
      password === 'password@123'
    ) {
      setTimeout(() => {
        setToast({
          message: 'Master Access Granted. Welcome Admin.',
          type: 'success',
        })

        const mockAdminData = {
          id: 999,
          name: 'EasyGear Administrator',
          email: 'admin@easygear.ng',
          role: 'System Root',
          phone: '+234 000 000 000',
          store_name: 'Main Terminal',
        }

        localStorage.setItem('easygear_token', 'mock_admin_token_bypass')
        localStorage.setItem('user', JSON.stringify(mockAdminData))

        setTimeout(() => router.replace('/admin'), 1500)
        setLoading(false)
      }, 1000)
      return
    }

    // --- STANDARD VENDOR LOGIC ---
    try {
      const baseUrl = 'https://api.easygear.ng/api/v1'
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ login: email, password: password }),
      })

      const result = await response.json()

      if (result.success || response.ok) {
        setToast({
          message: 'Access Granted. Initializing...',
          type: 'success',
        })

        const token = result.data?.token
        if (token) localStorage.setItem('easygear_token', token)

        const userProfile = result.data?.user
        const userData = {
          id: userProfile?.id,
          name: userProfile?.name,
          email: userProfile?.email,
          role: userProfile?.role,
          phone: userProfile?.phone_number,
          store_name: userProfile?.store_name,
        }
        localStorage.setItem('user', JSON.stringify(userData))

        setTimeout(() => {
          if (userData.role === 'System Root') {
            router.replace('/admin')
          } else {
            router.replace('/vendor')
          }
        }, 1500)
      } else {
        const errorMsg = result.errors
          ? (Object.values(result.errors).flat()[0] as string)
          : result.message
        setToast({
          message: errorMsg || 'Authentication Failed',
          type: 'error',
        })
      }
    } catch (error) {
      setToast({ message: 'Server Connection Error.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden'>
      {toast && (
        <div
          className={cn(
            'fixed top-6 right-6 z-100 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 transition-all duration-500 animate-in slide-in-from-right-full',
            toast.type === 'success'
              ? 'bg-green-600 border-green-400 text-white'
              : 'bg-slate-900 border-red-500 text-white'
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} className='text-red-500' />
          )}
          <p className='text-xs font-black uppercase tracking-widest'>
            {toast.message}
          </p>
          <button onClick={() => setToast(null)} className='ml-2'>
            <X size={16} />
          </button>
        </div>
      )}

      <div className='w-full max-w-xl'>
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-black italic tracking-tighter text-slate-900 uppercase'>
            easyGear<span className='text-orange-500'>.</span>
          </h1>
          <p className='text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs'>
            Terminal Access Control
          </p>
        </div>

        <div className='bg-white rounded-5xl border-4 border-white shadow-2xl overflow-hidden'>
          <div className='flex p-2 bg-slate-100/50 m-6 rounded-3xl border border-slate-200/50'>
            <button
              type='button'
              onClick={() => setRole('admin')}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all',
                role === 'admin'
                  ? 'bg-white text-blue-600 shadow-xl'
                  : 'text-slate-400'
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
                  ? 'bg-white text-orange-500 shadow-xl'
                  : 'text-slate-400'
              )}
            >
              <Store size={18} strokeWidth={3} /> Vendor
            </button>
          </div>

          <form onSubmit={handleLogin} className='p-10 pt-4 space-y-6'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2'>
                Identity Email
              </label>
              <div className='relative group'>
                <Mail
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2',
                    role === 'admin'
                      ? 'text-slate-300 group-focus-within:text-blue-600'
                      : 'text-slate-300 group-focus-within:text-orange-500'
                  )}
                  size={20}
                />
                <input
                  name='email'
                  type='email'
                  required
                  placeholder='admin@easygear.ng'
                  className='w-full pl-14 pr-6 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white transition-all'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between px-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                  Security Key
                </label>
              </div>
              <div className='relative group'>
                <Lock
                  className={cn(
                    'absolute left-5 top-1/2 -translate-y-1/2',
                    role === 'admin'
                      ? 'text-slate-300 group-focus-within:text-blue-600'
                      : 'text-slate-300 group-focus-within:text-orange-500'
                  )}
                  size={20}
                />
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder='••••••••'
                  className='w-full pl-14 pr-14 py-5 bg-slate-50 border-4 border-transparent rounded-3xl outline-none font-bold text-sm focus:bg-white transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-5 top-1/2 -translate-y-1/2 text-slate-300'
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className={cn(
                'w-full py-6 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95',
                role === 'admin'
                  ? 'bg-blue-600 shadow-blue-600/20'
                  : 'bg-orange-500 shadow-orange-500/20'
              )}
            >
              {loading ? (
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              ) : (
                <>
                  <span>Unlock Portal</span>
                  <ChevronRight size={18} strokeWidth={4} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
