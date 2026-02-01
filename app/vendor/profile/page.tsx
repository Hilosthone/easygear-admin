'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  Lock,
  Smartphone,
  ShieldAlert,
  Zap,
  Cpu,
  Fingerprint,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
  })

  useEffect(() => {
    const sessionData = localStorage.getItem('user')
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData)
        setFormData({
          name: user.name || user.business_name || '',
          email: user.email || '',
          role: user.role || 'Verified Merchant',
          bio: user.bio || 'Professional gear vendor node.',
        })
      } catch (e) {
        console.error('Terminal Data Corrupt')
      }
    }
  }, [])

  const getPasswordStrength = () => {
    if (!newPassword) return 0
    let score = 0
    if (newPassword.length > 8) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++
    return score
  }

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (activeTab === 'profile') {
        localStorage.setItem('user', JSON.stringify({ ...formData }))
      }
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }, 1000)
  }

  return (
    <div className='max-w-5xl mx-auto p-4 md:p-10 space-y-8 min-h-screen bg-white'>
      {/* Protocol Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-slate-50 pb-8'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Cpu size={14} className='text-brand-orange animate-pulse' />
            <p className='text-[9px] font-black uppercase tracking-[0.3em] text-slate-400'>
              System Configuration
            </p>
          </div>
          <h1 className='text-3xl font-black text-slate-900 uppercase tracking-tighter'>
            Terminal<span className='text-brand-orange'>.</span>Settings
          </h1>
        </div>

        <div className='flex bg-slate-100 p-1 rounded-xl border border-slate-200/50'>
          {['profile', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                'px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                activeTab === tab
                  ? 'bg-white text-brand-orange shadow-sm'
                  : 'text-slate-400 hover:text-slate-600',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Profile Sidebar */}
        <div className='lg:col-span-4 space-y-4'>
          <div className='bg-slate-50 p-6 rounded-4xl border-2 border-slate-100 text-center relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='w-20 h-20 mx-auto rounded-2xl bg-brand-orange flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-orange-500/20'>
                {formData.name.charAt(0) || 'V'}
              </div>
              <h3 className='mt-4 font-black text-slate-900 uppercase text-sm tracking-tight'>
                {formData.name || 'Vendor Node'}
              </h3>
              <p className='text-brand-orange font-bold text-[8px] uppercase tracking-widest mt-1 italic'>
                {formData.role}
              </p>
            </div>
            <Fingerprint className='absolute -bottom-4 -right-4 w-24 h-24 text-slate-200/50 -rotate-12' />
          </div>

          <div className='bg-slate-900 p-5 rounded-4xl text-white border-b-4 border-brand-orange shadow-xl'>
            <div className='flex items-center gap-3 mb-2'>
              <ShieldAlert className='text-brand-orange' size={16} />
              <p className='text-[9px] font-black uppercase tracking-widest'>
                Encryption Active
              </p>
            </div>
            <p className='text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter'>
              Data packets are AES-256 encrypted before transmission to the
              GearHub core.
            </p>
          </div>
        </div>

        {/* Main Terminal Form */}
        <div className='lg:col-span-8'>
          <form
            onSubmit={handleSync}
            className='bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6'
          >
            {activeTab === 'profile' ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300'>
                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-[9px] font-black uppercase text-slate-400 ml-1'>
                    Merchant Identity
                  </label>
                  <div className='relative group'>
                    <User
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange'
                      size={16}
                    />
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-brand-orange outline-none font-bold text-xs transition-all'
                    />
                  </div>
                </div>

                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-[9px] font-black uppercase text-slate-400 ml-1'>
                    Comm-Link Email
                  </label>
                  <div className='relative group'>
                    <Mail
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-orange'
                      size={16}
                    />
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-brand-orange outline-none font-bold text-xs transition-all'
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Lock size={14} className='text-brand-orange' />
                    <p className='text-[10px] font-black uppercase tracking-widest text-slate-900'>
                      Access Credentials
                    </p>
                  </div>
                  <input
                    type='password'
                    placeholder='Current Password'
                    className='w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-brand-orange outline-none font-bold text-xs'
                  />
                  <div className='space-y-2'>
                    <input
                      type='password'
                      placeholder='New Terminal Key'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className='w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-brand-orange outline-none font-bold text-xs'
                    />
                    <div className='flex gap-1.5 px-1'>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-all',
                            getPasswordStrength() >= i
                              ? 'bg-brand-orange'
                              : 'bg-slate-100',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className='p-4 bg-slate-50 rounded-2xl flex items-center justify-between border-2 border-transparent hover:border-slate-200 transition-all'>
                  <div className='flex items-center gap-3'>
                    <Smartphone size={18} className='text-brand-orange' />
                    <div>
                      <p className='text-[10px] font-black uppercase text-slate-900 leading-none'>
                        2FA Auth
                      </p>
                      <p className='text-[8px] font-bold text-slate-400 mt-1 uppercase'>
                        Node Verification Required
                      </p>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={cn(
                      'w-10 h-5 rounded-full relative transition-all',
                      twoFactor ? 'bg-brand-orange' : 'bg-slate-300',
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-3 h-3 bg-white rounded-full transition-all',
                        twoFactor ? 'left-6' : 'left-1',
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            <button
              disabled={loading}
              className={cn(
                'w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70',
                success
                  ? 'bg-emerald-500'
                  : 'bg-slate-900 hover:bg-black shadow-lg shadow-slate-200',
              )}
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              ) : success ? (
                <>
                  <CheckCircle2 size={16} strokeWidth={3} /> Protocol Synced
                </>
              ) : (
                <>
                  <Zap size={14} className='text-brand-orange' /> Update
                  Terminal Node
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}