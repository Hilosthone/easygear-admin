'use client'

import React, { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Store,
  AlertCircle,
  Search,
  Filter,
  Package,
  ArrowUpRight,
  ShieldAlert,
  BadgeCheck,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface Vendor {
  id: string
  name: string
  owner: string
  email: string
  password?: string
  status: 'Approved' | 'Pending' | 'Flagged' | 'Suspended'
}

const MOCK_VENDORS: Vendor[] = [
  {
    id: '101',
    name: 'Titan Fitness',
    owner: 'John Doe',
    email: 'john@titan.fit',
    password: 'password123',
    status: 'Approved',
  },
  {
    id: '102',
    name: 'Apex Gear',
    owner: 'Sarah Chen',
    email: 'sarah@apex.io',
    password: 'secure_pass',
    status: 'Pending',
  },
  {
    id: '103',
    name: 'Rogue Supply',
    owner: 'Mike Ross',
    email: 'mike@rogue.com',
    password: 'rogue_vault',
    status: 'Flagged',
  },
  {
    id: '104',
    name: 'Velocity Sports',
    owner: 'Emma Wilson',
    email: 'emma@velocity.net',
    password: 'vel_2024_auth',
    status: 'Approved',
  },
]

export default function VendorManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [vendors] = useState<Vendor[]>(MOCK_VENDORS)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  )

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = v.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className='max-w-350 mx-auto space-y-10 pb-20 px-6'>
      {/* Header & Controls */}
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6'>
        <div className='space-y-2'>
          <h1 className='text-4xl font-black tracking-tighter uppercase italic text-slate-900'>
            Nexus / Vendors
          </h1>
          <p className='text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase'>
            Entity Control Terminal
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          {/* Status Filter */}
          <div className='relative'>
            <Filter
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
              size={16}
            />
            <select
              className='pl-10 pr-8 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-[10px] tracking-widest appearance-none focus:outline-none focus:border-blue-600 cursor-pointer'
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='All'>ALL STATUSES</option>
              <option value='Pending'>PENDING ONLY</option>
              <option value='Approved'>APPROVED ONLY</option>
              <option value='Flagged'>FLAGGED ONLY</option>
            </select>
          </div>

          {/* Search Input */}
          <div className='relative group'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors'
              size={18}
            />
            <input
              type='text'
              placeholder='FILTER BY STORE NAME...'
              className='pl-12 pr-6 py-4 bg-white border-4 border-slate-100 rounded-2xl w-80 font-black text-[10px] tracking-widest focus:outline-none focus:border-blue-600 transition-all'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          label='Pending Approval'
          value={vendors.filter((v) => v.status === 'Pending').length}
          color='orange'
          Icon={AlertCircle}
        />
        <StatCard
          label='Verified Merchants'
          value={vendors.filter((v) => v.status === 'Approved').length}
          color='blue'
          Icon={BadgeCheck}
        />
        <StatCard
          label='Risk Flags'
          value={vendors.filter((v) => v.status === 'Flagged').length}
          color='red'
          Icon={ShieldAlert}
        />
        <StatCard
          label='Total Entities'
          value={vendors.length}
          color='slate'
          Icon={Package}
        />
      </div>

      {/* Table Container - Custom 3rem corners applied here */}
      <div className='bg-white border-4 border-slate-100 rounded-5xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/50 border-b-4 border-slate-100'>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400'>
                  Store Hierarchy
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400'>
                  Access Credentials
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400'>
                  Compliance
                </th>
                <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right'>
                  Action Node
                </th>
              </tr>
            </thead>
            <tbody className='divide-y-4 divide-slate-50'>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className='hover:bg-slate-50/80 transition-all group'
                  >
                    <td className='px-10 py-8'>
                      <div className='flex items-center gap-5'>
                        <div className='w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all'>
                          <Store size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className='font-black text-slate-900 text-lg uppercase tracking-tighter leading-none'>
                            {vendor.name}
                          </p>
                          <p className='text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest'>
                            ID: V-{vendor.id} • {vendor.owner}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-10 py-8'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                          <KeyRound size={12} className='text-blue-500' />
                          <span className='font-mono text-[10px] font-bold tracking-widest bg-slate-100 px-2 py-1 rounded'>
                            {showPasswords[vendor.id]
                              ? vendor.password
                              : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => togglePassword(vendor.id)}
                            className='text-slate-400 hover:text-blue-600 transition-colors'
                          >
                            {showPasswords[vendor.id] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                        <p className='text-[10px] font-black text-slate-900 uppercase tracking-tight'>
                          {vendor.email}
                        </p>
                      </div>
                    </td>
                    <td className='px-10 py-8'>
                      <StatusBadge status={vendor.status} />
                    </td>
                    <td className='px-10 py-8 text-right'>
                      <div className='flex items-center justify-end gap-3'>
                        {vendor.status === 'Pending' ? (
                          <div className='flex gap-2'>
                            <button className='p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border-2 border-emerald-100'>
                              <CheckCircle size={20} />
                            </button>
                            <button className='p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border-2 border-red-100'>
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <button className='px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all'>
                            Profile{' '}
                            <ArrowUpRight size={14} className='inline ml-1' />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='px-10 py-20 text-center'>
                    <p className='font-black text-slate-300 text-[10px] uppercase tracking-[0.5em]'>
                      No entities match your filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, Icon }: StatCardProps) {
  const colors = {
    orange: 'bg-orange-50 border-orange-100 text-orange-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    red: 'bg-red-50 border-red-100 text-red-600',
    slate: 'bg-slate-50 border-slate-100 text-slate-900',
  }
  const iconBgs = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-600',
    red: 'bg-red-500',
    slate: 'bg-slate-900',
  }

  return (
    <div
      className={cn(
        'border-4 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm transition-all hover:-translate-y-1',
        colors[color]
      )}
    >
      <div
        className={cn('p-4 rounded-2xl text-white shadow-lg', iconBgs[color])}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <p className='text-[10px] font-black uppercase tracking-[0.3em] opacity-60'>
          {label}
        </p>
        <p className='text-3xl font-black tracking-tighter mt-1 italic'>
          {value.toString().padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Vendor['status'] }) {
  const styles: Record<string, string> = {
    Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Pending: 'bg-orange-50 text-orange-600 border-orange-100',
    Flagged: 'bg-red-50 text-red-600 border-red-100 animate-pulse',
    Suspended: 'bg-slate-100 text-slate-400 border-slate-200',
  }
  return (
    <span
      className={cn(
        'px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2',
        styles[status] || styles.Suspended
      )}
    >
      {status}
    </span>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  color: 'orange' | 'blue' | 'red' | 'slate'
  Icon: LucideIcon
}
