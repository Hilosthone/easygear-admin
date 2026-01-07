'use client'

import React from 'react'
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function AdminReportsPage() {
  return (
    <div className='space-y-10'>
      {/* Header & Date Picker */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-4xl font-black text-brand-slate tracking-tight'>
            Analytics Engine
          </h1>
          <p className='text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em]'>
            Data-driven platform insights
          </p>
        </div>
        <div className='flex gap-3'>
          <div className='flex items-center gap-2 bg-white border-4 border-slate-100 px-6 py-3 rounded-2xl shadow-sm'>
            <Calendar size={18} className='text-brand-blue' strokeWidth={3} />
            <span className='font-black text-sm text-brand-slate whitespace-nowrap'>
              Jan 01 - Jan 07, 2026
            </span>
          </div>
          <button className='p-4 bg-brand-slate text-white rounded-2xl hover:bg-brand-blue transition-all'>
            <Download size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Sales Trend Placeholder */}
        <div className='lg:col-span-2 bg-white border-4 border-slate-100 rounded-5xl p-10 shadow-sm min-h-100 flex flex-col'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='text-xl font-black text-brand-slate flex items-center gap-3'>
              <LineChart className='text-brand-blue' />
              Weekly Sales Velocity
            </h3>
            <div className='flex gap-2'>
              <span className='px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-black rounded-lg'>
                GROSS REV
              </span>
              <span className='px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black rounded-lg'>
                NET PROFIT
              </span>
            </div>
          </div>
          <div className='flex-1 bg-slate-50 rounded-4xl border-4 border-dashed border-slate-200 flex items-center justify-center italic text-slate-300 font-black'>
            {/*  */}
            Interactive Chart Visualization
          </div>
        </div>

        {/* Top Performing Vendors */}
        <div className='bg-white border-4 border-slate-100 rounded-5xl p-10 shadow-sm flex flex-col'>
          <h3 className='text-xl font-black text-brand-slate mb-8 flex items-center gap-3'>
            <TrendingUp className='text-brand-orange' />
            Top Vendors
          </h3>
          <div className='space-y-6'>
            <VendorRank
              rank={1}
              name='Nike Official'
              sales='₦2.4M'
              growth='+18%'
            />
            <VendorRank
              rank={2}
              name='Mountain Pros'
              sales='₦1.8M'
              growth='+12%'
            />
            <VendorRank rank={3} name='Decathlon' sales='₦1.1M' growth='+5%' />
            <VendorRank
              rank={4}
              name='Sporty-X'
              sales='₦850k'
              growth='-2%'
              isDown
            />
          </div>
          <button className='mt-auto w-full py-4 border-4 border-slate-50 rounded-2xl font-black text-slate-400 hover:text-brand-blue hover:border-brand-blue/10 transition-all'>
            View Full Leaderboard
          </button>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <CategoryCard label='Footwear' percentage={45} color='bg-brand-blue' />
        <CategoryCard
          label='Camping Gear'
          percentage={25}
          color='bg-brand-orange'
        />
        <CategoryCard
          label='Accessories'
          percentage={20}
          color='bg-purple-500'
        />
        <CategoryCard label='Gym Wear' percentage={10} color='bg-emerald-500' />
      </div>
    </div>
  )
}

function VendorRank({ rank, name, sales, growth, isDown }: any) {
  return (
    <div className='flex items-center justify-between group cursor-default'>
      <div className='flex items-center gap-4'>
        <span className='text-2xl font-black text-slate-200 group-hover:text-brand-blue transition-colors'>
          0{rank}
        </span>
        <div>
          <p className='font-black text-brand-slate leading-none'>{name}</p>
          <p className='text-xs font-bold text-slate-400 mt-1'>
            {sales} volume
          </p>
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-1 font-black text-xs',
          isDown ? 'text-red-500' : 'text-emerald-500'
        )}
      >
        {isDown ? (
          <ArrowDownRight size={14} strokeWidth={3} />
        ) : (
          <ArrowUpRight size={14} strokeWidth={3} />
        )}
        {growth}
      </div>
    </div>
  )
}

function CategoryCard({ label, percentage, color }: any) {
  return (
    <div className='bg-white border-4 border-slate-100 p-8 rounded-[2.5rem] shadow-sm'>
      <div className='flex justify-between items-end'>
        <div>
          <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1'>
            {label}
          </p>
          <h4 className='text-3xl font-black text-brand-slate'>
            {percentage}%
          </h4>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg',
            color
          )}
        >
          <PieChart size={20} strokeWidth={3} />
        </div>
      </div>
      <div className='mt-6 h-3 bg-slate-100 rounded-full overflow-hidden'>
        <div
          className={cn('h-full transition-all duration-1000', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}