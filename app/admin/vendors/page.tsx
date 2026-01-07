'use client'

import { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Store,
  ExternalLink,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Package,
  ArrowUpRight,
  ShieldAlert,
  BadgeCheck,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

// Expanded Vendor Dataset
const VENDORS = [
  {
    id: 'V-101',
    name: 'Decathlon Sports',
    owner: 'Jean-Pierre',
    location: 'Lagos, NG',
    status: 'Pending',
    performance: 'N/A',
    gearCount: 0,
    revenue: '₦0',
  },
  {
    id: 'V-102',
    name: 'Nike Official Store',
    owner: 'Sarah Chen',
    location: 'Abuja, NG',
    status: 'Approved',
    performance: '4.8',
    gearCount: 124,
    revenue: '₦4.2M',
  },
  {
    id: 'V-103',
    name: 'Mountain Pros',
    owner: 'Ibrahim Musa',
    location: 'Jos, NG',
    status: 'Approved',
    performance: '4.2',
    gearCount: 42,
    revenue: '₦890K',
  },
  {
    id: 'V-104',
    name: 'Alpha Tactical',
    owner: 'Marcus Wright',
    location: 'Port Harcourt, NG',
    status: 'Flagged',
    performance: '2.1',
    gearCount: 89,
    revenue: '₦2.1M',
  },
  {
    id: 'V-105',
    name: 'Lagos Hike Club',
    owner: 'Tunde Afolayan',
    location: 'Lagos, NG',
    status: 'Approved',
    performance: '4.9',
    gearCount: 15,
    revenue: '₦320K',
  },
  {
    id: 'V-106',
    name: 'Summit Gear NG',
    owner: 'Blessing Okon',
    location: 'Enugu, NG',
    status: 'Pending',
    performance: 'N/A',
    gearCount: 0,
    revenue: '₦0',
  },
  {
    id: 'V-107',
    name: 'Desert Runners',
    owner: 'Aminu Kano',
    location: 'Kano, NG',
    status: 'Approved',
    performance: '4.5',
    gearCount: 67,
    revenue: '₦1.5M',
  },
  {
    id: 'V-108',
    name: 'Oceanic Dive Shop',
    owner: 'Victor Eke',
    location: 'Lekki, NG',
    status: 'Suspended',
    performance: '1.2',
    gearCount: 30,
    revenue: '₦450K',
  },
]

export default function VendorManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700'>
      {/* Header Section */}
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6'>
        <div>
          <h1 className='text-5xl font-black text-brand-slate tracking-tighter italic uppercase'>
            Vendor Command
          </h1>
          <p className='text-slate-400 font-black mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-2'>
            <Store size={14} className='text-brand-blue' />
            Merchant Ecosystem & Global Compliance
          </p>
        </div>

        <div className='flex flex-wrap gap-4'>
          <div className='relative group'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors'
              size={18}
              strokeWidth={3}
            />
            <input
              type='text'
              placeholder='Filter by Store or ID...'
              className='pl-12 pr-6 py-4 bg-white border-4 border-slate-100 rounded-2xl outline-none font-black text-xs uppercase tracking-widest focus:border-brand-blue transition-all w-full md:w-80 shadow-sm'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className='p-4 bg-white border-4 border-slate-100 rounded-2xl text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm'>
            <Filter size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Industrial Summary Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          label='Pending Approval'
          value='02'
          color='orange'
          icon={<AlertCircle />}
        />
        <StatCard
          label='Verified Merchants'
          value='54'
          color='blue'
          icon={<BadgeCheck />}
        />
        <StatCard
          label='Risk Flags'
          value='03'
          color='red'
          icon={<ShieldAlert />}
        />
        <StatCard
          label='Total Catalog'
          value='1.2k'
          color='slate'
          icon={<Package />}
        />
      </div>

      {/* Vendors Terminal Table */}
      <div className='bg-white border-4 border-slate-100 rounded-5xl shadow-2xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/50 border-b-4 border-slate-100'>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  Store Hierarchy
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  Geographic Hub
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  Performance Index
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  Compliance
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right'>
                  Action Node
                </th>
              </tr>
            </thead>
            <tbody className='divide-y-4 divide-slate-50'>
              {VENDORS.filter((v) =>
                v.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((vendor) => (
                <tr
                  key={vendor.id}
                  className='hover:bg-slate-50/80 transition-all group'
                >
                  <td className='px-10 py-8'>
                    <div className='flex items-center gap-5'>
                      <div className='w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-transparent group-hover:border-brand-blue/20 group-hover:bg-white group-hover:text-brand-blue transition-all'>
                        <Store size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className='font-black text-brand-slate text-xl tracking-tighter uppercase leading-none'>
                          {vendor.name}
                        </p>
                        <p className='text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest'>
                          ID: {vendor.id} • {vendor.owner}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-10 py-8'>
                    <div className='flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-tight'>
                      <MapPin
                        size={14}
                        className='text-brand-orange'
                        strokeWidth={3}
                      />
                      {vendor.location}
                    </div>
                  </td>
                  <td className='px-10 py-8'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-1 font-black text-brand-slate text-lg italic'>
                        {vendor.performance !== 'N/A'
                          ? `★ ${vendor.performance}`
                          : '---'}
                      </div>
                      <p className='text-[9px] font-black text-slate-300 uppercase'>
                        {vendor.gearCount} Units Linked
                      </p>
                    </div>
                  </td>
                  <td className='px-10 py-8'>
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className='px-10 py-8'>
                    <div className='flex items-center justify-end gap-3'>
                      {vendor.status === 'Pending' ? (
                        <>
                          <button className='p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border-2 border-emerald-100'>
                            <CheckCircle size={20} strokeWidth={3} />
                          </button>
                          <button className='p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border-2 border-red-100'>
                            <XCircle size={20} strokeWidth={3} />
                          </button>
                        </>
                      ) : (
                        <button className='flex items-center gap-3 px-6 py-3 bg-brand-slate text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-brand-blue/10'>
                          Internal View <ArrowUpRight size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: any) {
  const colors: any = {
    orange: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange',
    blue: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue',
    red: 'bg-red-50 border-red-100 text-red-600',
    slate: 'bg-slate-50 border-slate-100 text-brand-slate',
  }

  return (
    <div
      className={cn(
        'border-4 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm transition-transform hover:scale-[1.02]',
        colors[color]
      )}
    >
      <div
        className={cn(
          'p-4 rounded-2xl text-white shadow-lg',
          color === 'orange'
            ? 'bg-brand-orange'
            : color === 'blue'
            ? 'bg-brand-blue'
            : color === 'red'
            ? 'bg-red-500'
            : 'bg-brand-slate'
        )}
      >
        {icon}
      </div>
      <div>
        <p className='text-[10px] font-black uppercase tracking-[0.2em] opacity-70'>
          {label}
        </p>
        <p className='text-3xl font-black tracking-tighter mt-1'>{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Pending: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
    Flagged: 'bg-red-50 text-red-600 border-red-100 animate-pulse',
    Suspended: 'bg-slate-100 text-slate-400 border-slate-200',
  }

  return (
    <span
      className={cn(
        'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2',
        styles[status]
      )}
    >
      {status}
    </span>
  )
}
