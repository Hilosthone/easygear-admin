'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ShoppingBag,
  MapPin,
  AlertTriangle,
  User,
  Loader2,
  RefreshCcw,
  ExternalLink,
  Database,
  Inbox,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Cookies from 'js-cookie'

interface Order {
  id: string | number
  reference?: string
  product_name?: string
  client_name?: string
  rental_period?: string
  total_formatted?: string
  status: string
  location?: string
  created_at?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = Cookies.get('auth_token')
      const userString = localStorage.getItem('user')
      const user = userString ? JSON.parse(userString) : null
      const vendorId = user?.vendor_id || user?.id || user?.user_id

      if (!token || !vendorId) throw new Error('Authentication/Node ID missing')

      const res = await fetch(
        `${baseUrl}/vendor/orders?vendor_id=${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      const json = await res.json()
      if (json.success) setOrders(json.data?.data || json.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, refreshKey])

  const stats = useMemo(
    () => [
      {
        label: 'Active Orders',
        value: orders.filter((o) => o.status.toLowerCase() === 'in-progress')
          .length,
        color: 'text-blue-600',
      },
      {
        label: 'Pending Pickups',
        value: orders.filter((o) => o.status.toLowerCase() === 'pending')
          .length,
        color: 'text-brand-orange',
      },
      {
        label: 'Completed Orders',
        value: orders.filter((o) => o.status.toLowerCase() === 'completed')
          .length,
        color: 'text-emerald-500',
      },
    ],
    [orders],
  )

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase()
    if (s === 'completed') return 'bg-emerald-50 text-emerald-600'
    if (s === 'in-progress' || s === 'active') return 'bg-blue-50 text-blue-600'
    if (s === 'pending') return 'bg-amber-50 text-amber-600'
    return 'bg-red-50 text-red-600'
  }

  return (
    <div className='max-w-6xl mx-auto p-4 md:p-8 space-y-6 bg-white min-h-screen'>
      {/* Mini Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Database size={12} className='text-brand-orange' />
            <p className='text-[8px] font-black uppercase tracking-[0.3em] text-slate-400'>
              Order Protocol v1.0
            </p>
          </div>
          <h1 className='text-2xl font-black text-slate-900 uppercase tracking-tighter'>
            My<span className='text-brand-orange'>.</span>Orders
          </h1>
        </div>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className='flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-all'
        >
          <RefreshCcw size={12} className={cn(loading && 'animate-spin')} />
          {loading ? 'Syncing...' : 'Refresh Node'}
        </button>
      </div>

      {/* Grid Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='bg-slate-50/50 p-4 rounded-2xl border border-slate-100'
          >
            <p className='text-[8px] font-black uppercase tracking-widest text-slate-400'>
              {stat.label}
            </p>
            <p className={cn('text-2xl font-black mt-1', stat.color)}>
              {stat.value.toString().padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* Professional List View */}
      <div className='space-y-2 min-h-75'>
        {loading ? (
          <div className='py-20 flex flex-col items-center opacity-40'>
            <Loader2 className='animate-spin text-slate-900 mb-2' size={24} />
            <p className='text-[9px] font-black uppercase tracking-widest'>
              Accessing Ledger...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className='py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30'>
            <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4'>
              <Inbox size={20} className='text-slate-300' />
            </div>
            <h3 className='text-[10px] font-black uppercase tracking-widest text-slate-900'>
              No Orders Yet
            </h3>
            <p className='text-[9px] font-bold text-slate-400 uppercase mt-1'>
              Your deployment pipeline is currently empty.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className='group bg-white p-3 md:p-4 rounded-xl border border-slate-100 hover:border-brand-orange/30 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center gap-4'
            >
              <div className='md:w-32 shrink-0'>
                <p className='text-[9px] font-black text-slate-400 uppercase mb-1'>
                  #{order.reference || order.id}
                </p>
                <div
                  className={cn(
                    'inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter',
                    getStatusStyles(order.status),
                  )}
                >
                  {order.status.replace('-', ' ')}
                </div>
              </div>

              <div className='flex-1'>
                <h3 className='text-xs font-black text-slate-900 uppercase truncate max-w-xs'>
                  {order.product_name || 'Generic Equipment'}
                </h3>
                <div className='flex items-center gap-3 mt-1'>
                  <div className='flex items-center gap-1.5 text-slate-400'>
                    <User size={10} className='text-brand-orange' />
                    <span className='text-[9px] font-bold uppercase'>
                      {order.client_name || 'Guest'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5 text-slate-400'>
                    <MapPin size={10} />
                    <span className='text-[9px] font-bold uppercase truncate max-w-25'>
                      {order.location || 'Local'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50'>
                <div className='hidden lg:block text-right'>
                  <p className='text-[8px] font-black text-slate-400 uppercase'>
                    Deployment Period
                  </p>
                  <p className='text-[10px] font-bold text-slate-600'>
                    {order.rental_period || 'Short Term'}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-[8px] font-black text-slate-400 uppercase'>
                    Net Payout
                  </p>
                  <p className='text-sm font-black text-slate-900'>
                    {order.total_formatted || '₦0.00'}
                  </p>
                </div>
                <button className='p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-brand-orange hover:text-white transition-all'>
                  <ExternalLink size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Minimal Footer Warning */}
      {!loading && orders.some((o) => o.status.toLowerCase() === 'overdue') && (
        <div className='flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-pulse'>
          <AlertTriangle size={14} strokeWidth={3} />
          <p className='text-[9px] font-black uppercase tracking-widest'>
            Critical System Alert: Overdue Assets Detected
          </p>
        </div>
      )}
    </div>
  )
}