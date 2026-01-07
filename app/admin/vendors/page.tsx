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
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

// Dummy Vendor Data
const VENDORS = [
  {
    id: 'V-101',
    name: 'Decathlon Sports',
    owner: 'Jean-Pierre',
    location: 'Lagos, NG',
    status: 'Pending',
    performance: 'N/A',
    gearCount: 0,
  },
  {
    id: 'V-102',
    name: 'Nike Official Store',
    owner: 'Sarah Chen',
    location: 'Abuja, NG',
    status: 'Approved',
    performance: '4.8/5',
    gearCount: 124,
  },
  {
    id: 'V-103',
    name: 'Mountain Pros',
    owner: 'Ibrahim Musa',
    location: 'Jos, NG',
    status: 'Approved',
    performance: '4.2/5',
    gearCount: 42,
  },
]

export default function VendorManagementPage() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-black text-brand-slate tracking-tight'>
            Vendor Management
          </h1>
          <p className='text-slate-500 font-bold mt-1'>
            Review applications and monitor store performance.
          </p>
        </div>
      </div>

      {/* Summary Stats for Vendors */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-brand-orange/10 border-4 border-brand-orange/20 p-6 rounded-3xl flex items-center gap-4'>
          <div className='p-3 bg-brand-orange rounded-2xl text-white'>
            <AlertCircle size={24} strokeWidth={3} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-widest text-brand-orange'>
              Pending Review
            </p>
            <p className='text-2xl font-black text-brand-slate'>
              05 Applications
            </p>
          </div>
        </div>
        <div className='bg-emerald-50 border-4 border-emerald-100 p-6 rounded-3xl flex items-center gap-4'>
          <div className='p-3 bg-emerald-500 rounded-2xl text-white'>
            <ShieldCheck size={24} strokeWidth={3} />
          </div>
          <div>
            <p className='text-[10px] font-black uppercase tracking-widest text-emerald-600'>
              Active Stores
            </p>
            <p className='text-2xl font-black text-brand-slate'>48 Verified</p>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className='bg-white border-4 border-slate-100 rounded-[2.5rem] overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-slate-50 border-b-4 border-slate-100'>
              <tr>
                <th className='px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400'>
                  Store / Owner
                </th>
                <th className='px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400'>
                  Location
                </th>
                <th className='px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400'>
                  Performance
                </th>
                <th className='px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400'>
                  Status
                </th>
                <th className='px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right'>
                  Decision
                </th>
              </tr>
            </thead>
            <tbody className='divide-y-4 divide-slate-50'>
              {VENDORS.map((vendor) => (
                <tr
                  key={vendor.id}
                  className='hover:bg-slate-50/50 transition-colors group'
                >
                  <td className='px-8 py-6'>
                    <div className='flex items-center gap-4'>
                      <div className='w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-brand-blue border-2 border-slate-200 group-hover:bg-brand-blue group-hover:text-white transition-all'>
                        <Store size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className='font-black text-brand-slate text-lg leading-none'>
                          {vendor.name}
                        </p>
                        <p className='text-sm font-bold text-slate-400 mt-1'>
                          Owner: {vendor.owner}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-8 py-6'>
                    <div className='flex items-center gap-2 text-slate-500 font-bold'>
                      <MapPin
                        size={16}
                        className='text-brand-orange'
                        strokeWidth={3}
                      />
                      {vendor.location}
                    </div>
                  </td>
                  <td className='px-8 py-6 font-black text-brand-slate'>
                    {vendor.performance !== 'N/A' ? (
                      <span className='flex items-center gap-1 text-emerald-600'>
                        ★ {vendor.performance}
                      </span>
                    ) : (
                      <span className='text-slate-300 italic'>No Data</span>
                    )}
                  </td>
                  <td className='px-8 py-6'>
                    <span
                      className={cn(
                        'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2',
                        vendor.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
                      )}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className='px-8 py-6'>
                    <div className='flex items-center justify-end gap-2'>
                      {vendor.status === 'Pending' ? (
                        <>
                          <button className='px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase hover:bg-emerald-600 transition-all flex items-center gap-2'>
                            <CheckCircle size={14} strokeWidth={3} /> Approve
                          </button>
                          <button className='px-4 py-2 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase hover:bg-red-600 transition-all flex items-center gap-2'>
                            <XCircle size={14} strokeWidth={3} /> Reject
                          </button>
                        </>
                      ) : (
                        <button className='px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2'>
                          <ExternalLink size={14} strokeWidth={3} /> Manage
                          Store
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