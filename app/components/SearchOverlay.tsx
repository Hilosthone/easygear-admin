'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  Command,
  CornerDownLeft,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// Mock Database with scoped permissions
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
  {
    id: '8',
    type: 'log',
    name: 'System Override',
    detail: 'User: Root_Alpha - 14:20',
    scope: 'admin',
  },
]

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<'admin' | 'vendor' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userRole = localStorage.getItem('user_role')
    // Simulating role detection logic
    if (userRole === 'System Root') setRole('admin')
    else setRole('vendor')
  }, [])

  // Optimized Search Logic with role-based filtering
  const filteredResults = useMemo(() => {
    if (!query.trim()) return []
    return MOCK_RECORDS.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      const matchesScope = item.scope === role
      return matchesQuery && matchesScope
    })
  }, [query, role])

  // Keyboard Navigation: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const isVendor = role === 'vendor'
  const brandColor = isVendor ? 'text-brand-orange' : 'text-brand-blue'
  const accentBg = isVendor ? 'bg-orange-50' : 'bg-blue-50'
  const borderFocus = isVendor
    ? 'focus-within:border-brand-orange/30'
    : 'focus-within:border-brand-blue/30'

  return (
    <div className='fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4 sm:px-6'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-brand-slate/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300'
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full max-w-2xl bg-white rounded-5xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] border-4 border-white overflow-hidden animate-in zoom-in-95 slide-in-from-top-8 duration-300'
        )}
      >
        {/* Input Module */}
        <div
          className={cn(
            'p-8 border-b-2 border-slate-50 flex items-center gap-5 transition-all',
            borderFocus
          )}
        >
          <div className={cn('p-3 rounded-2xl shrink-0', accentBg, brandColor)}>
            <Search size={24} strokeWidth={3} />
          </div>
          <input
            ref={inputRef}
            autoFocus
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              role === 'admin'
                ? 'Search terminal: vendors, users, logs...'
                : 'Search your store: products, orders, settings...'
            }
            className='flex-1 bg-transparent outline-none text-xl font-black text-brand-slate placeholder:text-slate-300 uppercase tracking-tight'
          />
          <button
            onClick={onClose}
            className='p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-90'
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Dynamic Context View */}
        <div className='max-h-[50vh] overflow-y-auto custom-scrollbar bg-white'>
          {query.length > 0 ? (
            <div className='p-4 space-y-2'>
              <div className='px-4 py-3 flex items-center justify-between'>
                <p className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-400'>
                  Query Result Payload: {filteredResults.length} Units
                </p>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full border-2',
                    isVendor ? 'border-orange-100' : 'border-blue-100'
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full animate-pulse',
                      isVendor ? 'bg-brand-orange' : 'bg-brand-blue'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[9px] font-black uppercase tracking-widest',
                      brandColor
                    )}
                  >
                    {role} Access
                  </span>
                </div>
              </div>

              {filteredResults.map((item) => (
                <SearchResultItem
                  key={item.id}
                  type={item.type}
                  title={item.name}
                  desc={item.detail}
                  brandColor={brandColor}
                  accentBg={accentBg}
                  onClick={() => {
                    console.log(`Routing to Node: ${item.id}`)
                    onClose()
                  }}
                />
              ))}

              {filteredResults.length === 0 && (
                <div className='py-20 text-center space-y-4'>
                  <div className='inline-flex p-6 bg-slate-50 rounded-4xl text-slate-200'>
                    <Command size={48} strokeWidth={3} />
                  </div>
                  <p className='text-sm font-black text-slate-400 uppercase tracking-widest'>
                    No encrypted records found
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className='py-24 text-center group'>
              <div
                className={cn(
                  'inline-flex p-8 rounded-[2.5rem] mb-6 transition-transform group-hover:scale-110 duration-500',
                  accentBg
                )}
              >
                <History
                  className={cn('animate-spin-slow', brandColor)}
                  size={48}
                  strokeWidth={2.5}
                />
              </div>
              <h3 className='text-xl font-black text-brand-slate uppercase italic tracking-tighter'>
                Standby Mode
              </h3>
              <p className='text-[10px] font-bold text-slate-400 mt-3 max-w-70 mx-auto uppercase tracking-widest leading-relaxed'>
                System ready for deep-indexing. Search across{' '}
                <span className={brandColor}>
                  {role === 'admin' ? 'ecosystem logs' : 'inventory assets'}
                </span>
                .
              </p>
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className='p-6 bg-slate-50/80 border-t-2 border-slate-100 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
              <kbd className='px-2 py-1 bg-white border-2 border-slate-200 rounded-lg text-[10px] font-black shadow-sm'>
                <CornerDownLeft size={10} className='inline mr-1' />
                ENTER
              </kbd>
              <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Execute
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <kbd className='px-2 py-1 bg-white border-2 border-slate-200 rounded-lg text-[10px] font-black shadow-sm'>
                ESC
              </kbd>
              <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                Abort
              </span>
            </div>
          </div>

          <div className='hidden sm:flex items-center gap-3'>
            <ShieldCheck size={16} className={brandColor} />
            <span className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]'>
              Encrypted Tunnel Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultItem({
  type,
  title,
  desc,
  brandColor,
  accentBg,
  onClick,
}: any) {
  const getIcon = () => {
    switch (type) {
      case 'vendor':
        return <Store size={20} strokeWidth={2.5} />
      case 'user':
        return <User size={20} strokeWidth={2.5} />
      case 'product':
        return <Package size={20} strokeWidth={2.5} />
      case 'order':
        return <ShoppingCart size={20} strokeWidth={2.5} />
      default:
        return <ShieldCheck size={20} strokeWidth={2.5} />
    }
  }

  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-between p-5 hover:bg-slate-50 rounded-4xl group transition-all border-2 border-transparent hover:border-slate-100'
    >
      <div className='flex items-center gap-5'>
        <div
          className={cn(
            'h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12',
            accentBg,
            brandColor
          )}
        >
          {getIcon()}
        </div>
        <div className='text-left'>
          <p className='text-base font-black text-brand-slate uppercase tracking-tighter leading-none'>
            {title}
          </p>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2'>
            {desc}
          </p>
        </div>
      </div>
      <div
        className={cn(
          'p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1',
          accentBg,
          brandColor
        )}
      >
        <ArrowRight size={20} strokeWidth={3} />
      </div>
    </button>
  )
}