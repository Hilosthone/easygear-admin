'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Loader2,
  RefreshCcw,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Cookies from 'js-cookie'

interface Order {
  id: string | number
  reference?: string          // or order_number
  product_name?: string       // or item_name, gear_name
  client_name?: string
  rental_period?: string      // e.g. "Jan 12 - Jan 15"
  total_formatted?: string    // e.g. "₦1,350,000"
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | string
  location?: string           // delivery or pickup location
  // Add more fields as needed from your real API
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // You can later add pagination, filters, etc.
  // const [currentPage, setCurrentPage] = useState(1)
  // const [lastPage, setLastPage] = useState(1)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.easygear.ng/api/v1'

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = Cookies.get('auth_token')
      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      const userString = localStorage.getItem('user')
      const user = userString ? JSON.parse(userString) : null
      const vendorId = user?.vendor_id || user?.id || user?.user_id

      if (!vendorId) {
        throw new Error('Vendor ID not found in user data.')
      }

      const params = new URLSearchParams({
        vendor_id: vendorId.toString(),
        // page: currentPage.toString(),        // uncomment when adding pagination
        // sort_by: 'created_at',
        // sort_order: 'desc',
      })

      const url = `${baseUrl}/vendor/orders?${params.toString()}`
      // If your endpoint is different → change to:
      // const url = `${baseUrl}/vendor/rentals?...`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch orders (${res.status})`)
      }

      const json = await res.json()

      if (json.success && json.data) {
        setOrders(json.data.data || json.data || [])
        // setLastPage(json.data.last_page || 1)     // if paginated
        // setCurrentPage(json.data.current_page || currentPage)
      } else {
        throw new Error(json.message || 'Invalid response from server')
      }
    } catch (err: any) {
      console.error('Orders fetch error:', err)
      setError(err.message || 'Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, refreshKey])

  // Optional: map status to colors (extend as needed)
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600'
      case 'in-progress':
      case 'active':
        return 'bg-blue-50 text-blue-600'
      case 'pending':
        return 'bg-amber-50 text-amber-600'
      case 'cancelled':
      case 'overdue':
        return 'bg-red-50 text-red-600'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <div className='p-6 md:p-10 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div>
          <h1 className='text-4xl font-black text-brand-slate italic uppercase tracking-tighter'>
            Orders
          </h1>
          <p className='text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2'>
            Track active orders and purchases
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
          className='flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-brand-orange transition-colors'
        >
          <RefreshCcw size={14} className={cn(loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className='mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-2xl'>
          <p className='font-bold'>Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Order Stats – placeholder (you can later fetch real stats) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        {[
          { label: 'Active Orders', value: '12', color: 'text-brand-blue' },
          { label: 'Pending Pickups', value: '05', color: 'text-brand-orange' },
          { label: 'Completed Orders', value: '128', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-sm'
          >
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
              {stat.label}
            </p>
            <p className={cn('text-4xl font-black mt-2', stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className='space-y-4 relative'>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 rounded-3xl'>
            <Loader2 className='animate-spin text-brand-orange' size={48} />
          </div>
        )}

        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className='bg-white rounded-[2.5rem] border-4 border-slate-100 p-6 md:p-8 hover:border-brand-orange/20 transition-all group'
            >
              <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                {/* Gear & ID */}
                <div className='flex items-start gap-6'>
                  <div className='w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-all'>
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <div className='flex items-center gap-3 mb-1'>
                      <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                        {order.reference || order.id || '—'}
                      </span>
                      <div
                        className={cn(
                          'px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter',
                          getStatusStyles(order.status)
                        )}
                      >
                        {order.status.replace('-', ' ')}
                      </div>
                    </div>
                    <h3 className='text-xl font-black text-brand-slate uppercase tracking-tight'>
                      {order.product_name || 'Gear Rental'}
                    </h3>
                    <div className='flex items-center gap-4 mt-2'>
                      <div className='flex items-center gap-1.5 text-slate-400'>
                        <User size={14} />
                        <p className='text-[10px] font-bold uppercase'>
                          {order.client_name || '—'}
                        </p>
                      </div>
                      <div className='flex items-center gap-1.5 text-slate-400'>
                        <MapPin size={14} />
                        <p className='text-[10px] font-bold uppercase'>
                          {order.location || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics & Price */}
                <div className='flex flex-wrap items-center gap-4 lg:gap-12'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-slate-400'>
                      <Calendar size={14} />
                      <p className='text-[10px] font-black uppercase tracking-widest'>
                        Deployment Window
                      </p>
                    </div>
                    <p className='text-sm font-black text-brand-slate uppercase'>
                      {order.rental_period || '—'}
                    </p>
                  </div>

                  <div className='text-left lg:text-right'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1'>
                      Total Revenue
                    </p>
                    <p className='text-2xl font-black text-brand-slate'>
                      {order.total_formatted || '—'}
                    </p>
                  </div>

                  <button className='bg-slate-50 p-4 rounded-2xl text-slate-400 hover:bg-brand-slate hover:text-white transition-all'>
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className='bg-white rounded-[2.5rem] border-4 border-slate-100 p-12 text-center'>
              <Clock size={64} className='mx-auto text-slate-200 mb-6' />
              <h3 className='text-2xl font-black text-slate-600 mb-2'>
                No Orders Found
              </h3>
              <p className='text-slate-500'>
                Active orders and purchases will appear here.
              </p>
            </div>
          )
        )}
      </div>

      {/* Urgent Notice – keep as static for now or fetch from API later */}
      <div className='mt-10 p-8 bg-amber-50 rounded-5xl border-4 border-amber-100 flex items-center gap-6'>
        <div className='w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm'>
          <AlertTriangle size={28} strokeWidth={3} />
        </div>
        <div>
          <h4 className='font-black text-amber-900 uppercase text-xs tracking-widest'>
            Late Return Warning
          </h4>
          <p className='text-[11px] text-amber-700 font-bold uppercase mt-1'>
            The "Sony G-Master Lens" from ORD-7690 is 4 hours overdue. Initiate
            contact protocol.
          </p>
        </div>
      </div>
    </div>
  )
}