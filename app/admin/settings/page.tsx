'use client'

import React, { useState } from 'react'
import {
  Settings,
  Shield,
  Lock,
  Bell,
  Globe,
  Database,
  CreditCard,
  Save,
  User,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  Users,
  Key,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('Platform')
  const [isMaintenance, setIsMaintenance] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className='max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700'>
      {/* Header */}
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-5xl font-black text-brand-slate tracking-tighter italic uppercase'>
            Core Terminal
          </h1>
          <p className='text-slate-400 font-black mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2'>
            <Database size={12} className='text-brand-blue' />
            System Architecture & Security Layers
          </p>
        </div>
        <div className='hidden md:block text-right'>
          <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>
            Node Status
          </p>
          <p className='text-xs font-black text-emerald-500 uppercase'>
            Encrypted & Synced
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
        {/* Settings Navigation */}
        <div className='lg:col-span-1 space-y-3'>
          {['Platform', 'Security', 'Payouts', 'Staff Roles'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'w-full flex items-center justify-between px-6 py-5 rounded-4xl font-black text-xs uppercase tracking-widest transition-all border-4',
                activeTab === tab
                  ? 'bg-brand-blue border-brand-blue text-white shadow-2xl shadow-brand-blue/30 scale-105 z-10'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-brand-blue/20 hover:text-brand-slate'
              )}
            >
              <div className='flex items-center gap-4'>
                <TabIcon name={tab} isActive={activeTab === tab} />
                {tab}
              </div>
            </button>
          ))}
        </div>

        {/* Settings Form Area */}
        <div className='lg:col-span-3'>
          {/* General Platform Settings */}
          {activeTab === 'Platform' && (
            <div className='bg-white border-4 border-slate-100 rounded-[4rem] p-12 shadow-sm space-y-12'>
              <section className='space-y-8'>
                <div className='flex items-center gap-4 border-b-4 border-slate-50 pb-6'>
                  <div className='p-3 bg-blue-50 text-brand-blue rounded-2xl'>
                    <Globe size={24} />
                  </div>
                  <h3 className='text-2xl font-black text-brand-slate tracking-tight uppercase'>
                    Marketplace Logic
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                  <div className='space-y-3'>
                    <label className='text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2'>
                      Platform Commission (%)
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        defaultValue='10'
                        className='w-full px-8 py-5 bg-slate-50 border-4 border-transparent rounded-4xl focus:border-brand-blue focus:bg-white outline-none font-black text-xl text-brand-slate transition-all'
                      />
                      <span className='absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black'>
                        %
                      </span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <label className='text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2'>
                      Escrow Release (Days)
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        defaultValue='7'
                        className='w-full px-8 py-5 bg-slate-50 border-4 border-transparent rounded-4xl focus:border-brand-blue focus:bg-white outline-none font-black text-xl text-brand-slate transition-all'
                      />
                      <span className='absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black uppercase text-[10px]'>
                        Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Maintenance Toggle */}
                <div
                  className={cn(
                    'flex items-center justify-between p-8 rounded-[2.5rem] border-4 transition-all duration-500',
                    isMaintenance
                      ? 'bg-red-50 border-red-100'
                      : 'bg-slate-50 border-slate-100'
                  )}
                >
                  <div className='flex gap-5'>
                    <div
                      className={cn(
                        'p-4 rounded-2xl shrink-0',
                        isMaintenance
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-slate-400'
                      )}
                    >
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'font-black uppercase tracking-tight text-lg',
                          isMaintenance ? 'text-red-600' : 'text-brand-slate'
                        )}
                      >
                        Maintenance Mode
                      </p>
                      <p className='text-[11px] font-bold text-slate-400 mt-1 uppercase'>
                        Instantly disconnect checkout & storefronts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMaintenance(!isMaintenance)}
                    className={cn(
                      'w-20 h-10 rounded-full relative transition-all duration-300 shadow-inner',
                      isMaintenance ? 'bg-red-500' : 'bg-slate-200'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-8 h-8 bg-white rounded-full shadow-xl transition-all duration-300',
                        isMaintenance ? 'left-11' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              </section>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className='w-full py-6 bg-brand-slate text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-brand-blue transition-all shadow-2xl shadow-brand-blue/20'
              >
                {isSaving ? (
                  <Fingerprint className='animate-pulse' />
                ) : (
                  <Save size={18} strokeWidth={3} />
                )}
                {isSaving ? 'Verifying Identity...' : 'Commit Platform Changes'}
              </button>
            </div>
          )}

          {/* Staff Roles View */}
          {activeTab === 'Staff Roles' && (
            <div className='bg-white border-4 border-slate-100 rounded-[4rem] p-12 shadow-sm space-y-8'>
              <div className='flex justify-between items-center border-b-4 border-slate-50 pb-8'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-brand-orange/10 text-brand-orange rounded-2xl'>
                    <Users size={24} />
                  </div>
                  <h3 className='text-2xl font-black text-brand-slate tracking-tight uppercase'>
                    Permission Hierarchy
                  </h3>
                </div>
                <button className='bg-slate-50 hover:bg-brand-slate hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all'>
                  Add Admin Node
                </button>
              </div>

              <div className='space-y-4'>
                {[
                  {
                    name: 'Super Admin',
                    access: 'All Access',
                    color: 'bg-emerald-500',
                  },
                  {
                    name: 'Financial Auditor',
                    access: 'Treasury & Revenue',
                    color: 'bg-brand-blue',
                  },
                  {
                    name: 'Support Lead',
                    access: 'Users & Disputes',
                    color: 'bg-brand-orange',
                  },
                ].map((role) => (
                  <div
                    key={role.name}
                    className='group flex items-center justify-between p-6 bg-slate-50 border-4 border-transparent hover:border-slate-100 rounded-4xl transition-all'
                  >
                    <div className='flex items-center gap-5'>
                      <div className={cn('w-3 h-3 rounded-full', role.color)} />
                      <div>
                        <p className='font-black text-brand-slate uppercase text-sm tracking-tight'>
                          {role.name}
                        </p>
                        <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                          {role.access}
                        </p>
                      </div>
                    </div>
                    <button className='p-3 bg-white rounded-xl text-slate-300 hover:text-brand-blue transition-colors'>
                      <Key size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for Security/Payouts */}
          {(activeTab === 'Security' || activeTab === 'Payouts') && (
            <div className='bg-white border-4 border-slate-100 rounded-[4rem] p-24 shadow-sm flex flex-col items-center text-center'>
              <div className='w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 border-4 border-slate-50'>
                <Lock size={48} strokeWidth={3} />
              </div>
              <h3 className='text-3xl font-black text-brand-slate uppercase italic tracking-tighter'>
                {activeTab} Layer Locked
              </h3>
              <p className='text-slate-400 font-bold mt-4 max-w-sm uppercase text-[10px] tracking-widest leading-relaxed'>
                Full terminal decryption required to access {activeTab}{' '}
                protocols. Please contact System Architect.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabIcon({ name, isActive }: { name: string; isActive: boolean }) {
  const size = 20
  const strokeWidth = 3

  switch (name) {
    case 'Platform':
      return (
        <Globe
          size={size}
          strokeWidth={strokeWidth}
          className={isActive ? 'text-white' : 'text-brand-blue'}
        />
      )
    case 'Security':
      return (
        <Lock
          size={size}
          strokeWidth={strokeWidth}
          className={isActive ? 'text-white' : 'text-slate-300'}
        />
      )
    case 'Payouts':
      return (
        <CreditCard
          size={size}
          strokeWidth={strokeWidth}
          className={isActive ? 'text-white' : 'text-slate-300'}
        />
      )
    case 'Staff Roles':
      return (
        <ShieldCheck
          size={size}
          strokeWidth={strokeWidth}
          className={isActive ? 'text-white' : 'text-brand-orange'}
        />
      )
    default:
      return <Settings size={size} strokeWidth={strokeWidth} />
  }
}