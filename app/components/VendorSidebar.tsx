'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  UserCircle,
  Star,
  Tag,
  LifeBuoy,
  LogOut,
  X,
  Store,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const VENDOR_LINKS = [
  { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
  { name: 'My Products', href: '/vendor/products', icon: Package },
  { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Earnings', href: '/vendor/earnings', icon: Wallet },
  { name: 'Reviews', href: '/vendor/reviews', icon: Star },
  { name: 'Promotions', href: '/vendor/promotions', icon: Tag },
  { name: 'Profile', href: '/vendor/profile', icon: UserCircle },
  { name: 'Support', href: '/vendor/support', icon: LifeBuoy },
]

export default function VendorSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {
  const pathname = usePathname()

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-brand-slate/60 backdrop-blur-sm z-50 lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-60 w-72 bg-white text-brand-slate flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 border-r-4 border-slate-100',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='p-8 flex items-center justify-between shrink-0'>
          <Link
            href='/vendor'
            className='text-2xl font-black italic tracking-tighter'
          >
            easyGear<span className='text-brand-orange'>.</span>Vendor
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className='lg:hidden p-2 bg-slate-100 rounded-xl text-slate-400'
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <nav className='flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar'>
          {VENDOR_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all group',
                  isActive
                    ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-brand-slate'
                )}
              >
                <link.icon
                  size={20}
                  className={cn(
                    'transition-colors stroke-[2.5]',
                    isActive ? 'text-white' : 'group-hover:text-brand-orange'
                  )}
                />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className='p-4 mt-auto border-t-4 border-slate-100 space-y-3'>
          <div className='flex items-center gap-3 px-4 py-4 rounded-3xl bg-slate-50 border-2 border-slate-100'>
            <div className='w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-lg'>
              <Store size={20} strokeWidth={3} />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-black truncate text-brand-slate'>
                Nike Store
              </p>
              <p className='text-[10px] text-slate-400 uppercase tracking-widest font-bold'>
                Verified Vendor
              </p>
            </div>
          </div>
          <Link
            href='/login'
            className='flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-sm font-black text-slate-400 hover:bg-red-50 hover:text-white transition-all'
          >
            <LogOut size={20} strokeWidth={3} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  )
}