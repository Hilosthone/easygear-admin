// src/app/vendor/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Package,
  MousePointer2,
  CreditCard,
  ArrowUpRight,
  History,
  Activity,
  ShieldCheck,
} from 'lucide-react'

export default function VendorDashboardOverview() {
  const [storeName, setStoreName] = useState<string>('Initializing...')

  useEffect(() => {
    const sessionData = localStorage.getItem('user')
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData)
        setStoreName(
          user.business_name || user.store_name || user.name || 'Elite Vendor',
        )
      } catch (error) {
        setStoreName('Gear Merchant')
      }
    }
  }, [])

  return (
    <div className='max-w-6xl mx-auto p-4 md:p-8 space-y-6 min-h-screen bg-white'>
      {/* Top Protocol Bar */}
      <div className='flex items-center justify-between border-b-2 border-slate-50 pb-6'>
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20'>
            <ShieldCheck size={20} strokeWidth={3} />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-slate-400'>
                Vendor Protocol v1.0.4
              </p>
              <span className='px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase'>
                Active
              </span>
            </div>
            <h1 className='text-xl font-black text-brand-slate uppercase tracking-tight'>
              {storeName}{' '}
              <span className='text-slate-300 font-medium italic lowercase'>
                / dashboard
              </span>
            </h1>
          </div>
        </div>

        <div className='hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100'>
          <Activity size={14} className='text-brand-orange animate-pulse' />
          <p className='text-[10px] font-bold text-slate-500 uppercase tracking-tighter'>
            Node: Secured
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        {/* Compact Wallet Card */}
        <div className='lg:col-span-2 bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group border-2 border-slate-800 shadow-xl'>
          <div className='relative z-10 space-y-4'>
            <div className='flex justify-between items-start'>
              <p className='text-[9px] font-black uppercase tracking-widest text-slate-500'>
                Available Payout
              </p>
              <CreditCard size={18} className='text-brand-orange opacity-50' />
            </div>

            <h2 className='text-4xl font-black tracking-tighter'>
              ₦842,500.00
            </h2>

            <div className='flex gap-2 pt-2'>
              <button className='flex-1 flex items-center justify-center gap-2 py-3 bg-brand-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95'>
                Withdraw <ArrowUpRight size={14} strokeWidth={4} />
              </button>
              <button className='px-4 flex items-center justify-center bg-white/5 text-white rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 transition-all'>
                <History size={16} />
              </button>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className='absolute top-0 right-0 p-2 opacity-5'>
            <Activity size={120} />
          </div>
        </div>

        {/* Micro Stats Grid */}
        <div className='lg:col-span-2 grid grid-cols-2 gap-4'>
          <StatBox
            label='Live Orders'
            value='24'
            trend='+12%'
            icon={Package}
            color='text-orange-500'
          />
          <StatBox
            label='Visits'
            value='1.2k'
            trend='+5.4%'
            icon={MousePointer2}
            color='text-blue-500'
          />
        </div>
      </div>

      {/* Quick Action Overlay */}
      <div className='bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between'>
        <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
          System Alert: 2 orders require immediate dispatch
        </p>
        <button className='text-[10px] font-black uppercase text-brand-orange hover:underline'>
          View Queue
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className='bg-white p-5 rounded-3xl border-2 border-slate-100 hover:border-brand-orange/20 transition-all group'>
      <div className='flex justify-between items-start mb-3'>
        <div
          className={`p-2 rounded-lg bg-slate-50 ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon size={16} strokeWidth={3} />
        </div>
        <span className='text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded'>
          {trend}
        </span>
      </div>
      <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>
        {label}
      </p>
      <p className='text-2xl font-black text-slate-900 tracking-tight mt-1'>
        {value}
      </p>
    </div>
  )
}