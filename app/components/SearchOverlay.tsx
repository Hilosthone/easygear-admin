'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  User,
  Store,
  Package,
  ArrowRight,
  X,
  ShoppingCart,
  ShieldCheck,
  History,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// Mock Database for the "Pro" Terminal
const MOCK_RECORDS = [
  {
    id: '1',
    type: 'vendor',
    name: 'Electronics Hub',
    detail: '48 Active Products',
    scope: 'admin',
  },
  {
    id: '2',
    type: 'user',
    name: 'Sarah Jenkins',
    detail: 'Premium Tier Customer',
    scope: 'admin',
  },
  {
    id: '3',
    type: 'product',
    name: 'Sony WH-1000XM5',
    detail: 'In Stock: 12 units',
    scope: 'vendor',
  },
  {
    id: '4',
    type: 'order',
    name: 'Order #TG-9921',
    detail: 'Status: Processing',
    scope: 'vendor',
  },
  {
    id: '5',
    type: 'vendor',
    name: 'Gear Pro Store',
    detail: 'Pending Verification',
    scope: 'admin',
  },
  {
    id: '6',
    type: 'product',
    name: 'MacBook Air M3',
    detail: 'In Stock: 5 units',
    scope: 'vendor',
  },
  {
    id: '7',
    type: 'user',
    name: 'Mike Ross',
    detail: 'New Registration',
    scope: 'admin',
  },
]

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'admin' | 'vendor' | null>(null)

  useEffect(() => {
    const userRole = localStorage.getItem('user_role')
    if (userRole === 'System Root') setRole('admin')
    else if (userRole === 'Vendor') setRole('vendor')
  }, [])

  // Optimized Search Logic
  const filteredResults = useMemo(() => {
    if (!query.trim()) return []
    return MOCK_RECORDS.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase())
      const matchesScope = item.scope === role
      return matchesQuery && matchesScope
    })
  }, [query, role])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!isOpen) return null

  const isAlt = role === 'vendor'
  const brandColor = isAlt ? 'text-brand-orange' : 'text-brand-blue'
  const brandBg = isAlt ? 'bg-orange-50' : 'bg-blue-50'

  return (
    <div className='fixed inset-0 z-100 flex items-start justify-center pt-24 px-4 sm:px-6'>
      <div
        className='absolute inset-0 bg-brand-slate/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-300'
        onClick={onClose}
      />

      <div className='relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-zinc-200/50 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200'>
        {/* Search Input */}
        <div className='p-6 border-b border-zinc-100 flex items-center gap-4'>
          <Search className={brandColor} size={24} strokeWidth={2.5} />
          <input
            autoFocus
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              role === 'admin'
                ? 'Search terminal: vendors, users, logs...'
                : 'Search your store: products, orders, settings...'
            }
            className='flex-1 bg-transparent outline-none text-lg font-bold text-brand-slate placeholder:text-zinc-300'
          />
          <div className='flex items-center gap-2'>
            <span className='hidden sm:flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-tighter'>
              ESC
            </span>
            <button
              onClick={onClose}
              className='p-2 hover:bg-zinc-100 rounded-xl text-zinc-400'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className='max-h-[60vh] overflow-y-auto p-4 custom-scrollbar bg-white'>
          {query.length > 0 ? (
            <div className='space-y-1'>
              <div className='px-4 py-2 flex items-center justify-between'>
                <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                  {filteredResults.length} Results Found
                </p>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-md',
                    brandBg,
                    brandColor
                  )}
                >
                  {role?.toUpperCase()} ACCESS
                </span>
              </div>

              {filteredResults.map((item) => (
                <SearchResultItem
                  key={item.id}
                  icon={
                    item.type === 'vendor' ? (
                      <Store size={18} />
                    ) : item.type === 'user' ? (
                      <User size={18} />
                    ) : item.type === 'product' ? (
                      <Package size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )
                  }
                  title={item.name}
                  desc={item.detail}
                  color={isAlt ? 'orange' : 'blue'}
                  onClick={() => {
                    console.log(`Navigating to ${item.type}: ${item.id}`)
                    onClose()
                  }}
                />
              ))}

              {filteredResults.length === 0 && (
                <div className='py-12 text-center text-zinc-400'>
                  <p className='text-sm font-bold'>No matches for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className='py-10 text-center'>
              <div className={cn('inline-flex p-4 rounded-3xl mb-4', brandBg)}>
                <History className={brandColor} size={32} />
              </div>
              <p className='text-sm font-black text-brand-slate'>
                Terminal Standby
              </p>
              <p className='text-xs font-bold text-zinc-400 mt-1 max-w-70 mx-auto'>
                Search across{' '}
                {role === 'admin'
                  ? 'the entire ecosystem'
                  : 'your inventory and orders'}{' '}
                instantly.
              </p>
            </div>
          )}
        </div>

        {/* Pro Footer */}
        <div className='p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1.5'>
              <kbd className='px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-bold shadow-sm'>
                Enter
              </kbd>
              <span className='text-[10px] font-bold text-zinc-400 uppercase'>
                Select
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ShieldCheck size={14} className={brandColor} />
            <span className='text-[10px] font-black text-zinc-400 uppercase tracking-tighter'>
              easyGear Secure Search
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultItem({
  icon,
  title,
  desc,
  color,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  color: 'blue' | 'orange'
  onClick: () => void
}) {
  const isOrange = color === 'orange'
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl group transition-all'
    >
      <div className='flex items-center gap-4'>
        <div
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
            isOrange
              ? 'bg-orange-50 text-brand-orange'
              : 'bg-blue-50 text-brand-blue'
          )}
        >
          {icon}
        </div>
        <div className='text-left'>
          <p className='text-sm font-black text-brand-slate'>{title}</p>
          <p className='text-[11px] font-bold text-zinc-400'>{desc}</p>
        </div>
      </div>
      <ArrowRight
        size={18}
        className={cn(
          'text-zinc-200 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1',
          isOrange
            ? 'group-hover:text-brand-orange'
            : 'group-hover:text-brand-blue'
        )}
      />
    </button>
  )
}