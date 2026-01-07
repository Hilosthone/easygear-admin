'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Package,
  CreditCard,
  BarChart3,
  Ticket,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Wallet,
  ChevronDown,
  ChevronRight,
  Banknote,
  History,
  Building,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const ADMIN_LINKS = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Vendors', href: '/admin/vendors', icon: Store, badgeKey: 'Vendors' },
  {
    name: 'KYC Verification',
    href: '/admin/vendors/verify',
    icon: ShieldCheck,
    badgeKey: 'KYC',
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badgeKey: 'Orders',
  },
  { name: 'Products', href: '/admin/products', icon: Package },
  // Treasury is now handled separately as a dropdown below
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, badgeKey: 'Reports' },
  {
    name: 'Support',
    href: '/admin/support',
    icon: Ticket,
    badgeKey: 'Support',
  },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {
  const pathname = usePathname()
  const [adminName, setAdminName] = useState('Admin')
  const [adminRole, setAdminRole] = useState('Staff')
  const [mounted, setMounted] = useState(false)

  // State for Dropdown
  const [isTreasuryOpen, setIsTreasuryOpen] = useState(
    pathname.includes('/admin/financials')
  )

  useEffect(() => {
    setMounted(true)
    const name = localStorage.getItem('user_name')
    const role = localStorage.getItem('user_role')
    if (name) setAdminName(name)
    if (role) setAdminRole(role)
  }, [])

  const essentials: Record<string, number> = {
    Vendors: 2,
    KYC: 6,
    Orders: 5,
    Payments: 2,
    Support: 7,
    Reports: 2,
  }

  if (!mounted) return null

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-brand-slate/60 backdrop-blur-sm z-60 lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-70 w-72 bg-brand-blue text-white flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 border-r border-white/10 shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='p-8 flex items-center justify-between shrink-0'>
          <Link
            href='/admin'
            className='text-2xl font-black italic tracking-tighter'
            onClick={() => setIsOpen(false)}
          >
            easyGear<span className='text-brand-orange'>.</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className='lg:hidden p-2 bg-white/10 rounded-xl'
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <nav className='flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar scroll-smooth'>
          {ADMIN_LINKS.map((link, index) => {
            const isActive = pathname === link.href
            const badgeCount = link.badgeKey ? essentials[link.badgeKey] : null

            // Insert Treasury Dropdown after Products (index 5)
            const showTreasuryAfter = index === 5

            return (
              <React.Fragment key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all group border-2',
                    isActive
                      ? 'bg-blue-800 border-white/20 text-white shadow-lg shadow-blue-900/50'
                      : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <link.icon
                      size={20}
                      className={cn(
                        'stroke-[2.5]',
                        isActive
                          ? 'text-white'
                          : 'text-white/30 group-hover:text-white'
                      )}
                    />
                    <span>{link.name}</span>
                  </div>
                  {badgeCount && (
                    <span className='relative flex items-center justify-center min-w-6 h-6 px-2 rounded-lg text-[10px] font-black bg-brand-orange text-white shadow-md'>
                      {badgeCount}
                    </span>
                  )}
                </Link>

                {showTreasuryAfter && (
                  <div className='py-2'>
                    <button
                      onClick={() => setIsTreasuryOpen(!isTreasuryOpen)}
                      className={cn(
                        'w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all group border-2',
                        isTreasuryOpen || pathname.includes('/admin/financials')
                          ? 'text-white'
                          : 'text-white/50 hover:text-white'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Wallet
                          size={20}
                          className='stroke-[2.5] text-brand-orange'
                        />
                        <span>Treasury Hub</span>
                      </div>
                      {isTreasuryOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {isTreasuryOpen && (
                      <div className='mt-2 ml-4 pl-4 border-l-2 border-white/10 space-y-1 animate-in slide-in-from-top-2 duration-200'>
                        <Link
                          href='/admin/financials'
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all',
                            pathname === '/admin/financials'
                              ? 'bg-white/10 text-white'
                              : 'text-white/40 hover:text-white'
                          )}
                        >
                          <Banknote size={14} /> Settlements
                          <span className='ml-auto bg-brand-orange text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm'>
                            {essentials.Payments}
                          </span>
                        </Link>
                        <Link
                          href='/admin/financials/revenue'
                          className='flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all'
                        >
                          <History size={14} /> Revenue Logs
                        </Link>
                        <Link
                          href='/admin/financials/nodes'
                          className='flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all'
                        >
                          <Building size={14} /> Bank Nodes
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        <div className='p-4 mt-auto border-t border-white/10 space-y-3 bg-blue-950/20'>
          <div className='flex items-center gap-3 px-4 py-4 rounded-3xl bg-white/5 border border-white/10'>
            <div className='w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-orange/30'>
              <ShieldCheck size={20} strokeWidth={3} />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-black truncate text-white leading-none'>
                {adminName}
              </p>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-black mt-1.5'>
                {adminRole}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className='flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-sm font-black text-white/40 hover:bg-red-600 hover:text-white transition-all group'
          >
            <LogOut size={20} strokeWidth={3} />
            <span>Exit Terminal</span>
          </button>
        </div>
      </aside>
    </>
  )
}