// src/app/vendor/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Package,
  MousePointer2,
  CreditCard,
  ArrowUpRight,
  History,
} from 'lucide-react'

export default function VendorDashboardOverview() {
  const [storeName, setStoreName] = useState<string>('Initializing...')

  useEffect(() => {
    const sessionData = localStorage.getItem('user')
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData)
        /** * Based on your registration code:
         * You send 'formData.store_name' as 'business_name' to the API.
         * We check business_name first, then fallbacks.
         */
        setStoreName(
          user.business_name || user.store_name || user.name || 'Gear Vendor',
        )
      } catch (error) {
        setStoreName('Elite Vendor')
      }
    } else {
      setStoreName('Guest Terminal')
    }
  }, [])

  return (
    <div className='max-w-6xl mx-auto space-y-6 p-4'>
      {/* Header */}
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
            Dashboard
          </h1>
          <p className='text-sm text-slate-500 font-medium'>
            Managing{' '}
            <span className='text-brand-orange font-bold uppercase tracking-tight'>
              {storeName}
            </span>
          </p>
        </div>
        <div className='text-right hidden md:block'>
          <p className='text-[10px] uppercase tracking-wider text-slate-400 font-bold'>
            System Status
          </p>
          <p className='text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' /> Live
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Main Balance Card - EasyGear Orange */}
        <div className='bg-orange-500 p-8 rounded-3xl text-white shadow-lg shadow-orange-200/50 col-span-1 md:col-span-2 relative overflow-hidden group border-4 border-white/10'>
          <div className='relative z-10'>
            <p className='text-white/80 font-bold text-[11px] uppercase tracking-wider'>
              Available Balance
            </p>
            <h2 className='text-4xl font-black mt-3 tracking-tight'>
              ₦842,500.00
            </h2>

            <div className='mt-8 flex gap-3'>
              <button className='flex items-center gap-2 px-6 py-3 bg-white text-orange-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm'>
                Withdraw <ArrowUpRight size={16} strokeWidth={4} />
              </button>
              <button className='flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 active:scale-95'>
                <History size={16} strokeWidth={3} /> History
              </button>
            </div>
          </div>

          <CreditCard className='absolute -right-6 -bottom-6 w-32 h-32 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700' />
        </div>

        {/* Action Stats */}
        <div className='flex flex-col gap-4'>
          <MiniStat
            title='Pending Orders'
            value='24'
            unit='Awaiting Dispatch'
            icon={Package}
            color='text-amber-600'
            bgColor='bg-amber-50'
          />
          <MiniStat
            title='Store Traffic'
            value='1.2k'
            unit='Monthly Clicks'
            icon={MousePointer2}
            color='text-orange-600'
            bgColor='bg-orange-50'
          />
        </div>
      </div>
    </div>
  )
}

function MiniStat({ title, value, unit, icon: Icon, color, bgColor }: any) {
  return (
    <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-orange-500/20 transition-all group'>
      <div
        className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}
      >
        <Icon className='w-5 h-5' strokeWidth={2.5} />
      </div>
      <div>
        <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none'>
          {title}
        </p>
        <div className='flex items-baseline gap-1.5 mt-2'>
          <p className='text-xl font-black text-slate-900 leading-none'>
            {value}
          </p>
          <p className='text-[9px] text-slate-400 font-bold uppercase tracking-tighter'>
            {unit}
          </p>
        </div>
      </div>
    </div>
  )
}