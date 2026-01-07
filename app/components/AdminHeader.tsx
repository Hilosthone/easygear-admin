'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Search,
  Bell,
  Command,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import SearchOverlay from './SearchOverlay'

interface AdminHeaderProps {
  setIsOpen: (open: boolean) => void
}

export default function AdminHeader({ setIsOpen }: AdminHeaderProps) {
  const pathname = usePathname()
  const [adminName, setAdminName] = useState('Admin')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    if (name) setAdminName(name)
  }, [])

  // CMD+K Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-200/60'>
        <div className='flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10 gap-4'>
          {/* LEFT: Menu & Branding (Visible on all) */}
          <div className='flex items-center gap-2 sm:gap-4 shrink-0'>
            <button
              onClick={() => setIsOpen(true)}
              className='p-2.5 hover:bg-zinc-100 rounded-2xl lg:hidden text-zinc-500 active:scale-95 transition-all'
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>

            <div className='hidden sm:flex flex-col shrink-0'>
              <h1 className='text-sm font-black text-brand-slate tracking-tight'>
                Terminal <span className='text-brand-blue'>v1.0</span>
              </h1>
            </div>
          </div>

          {/* CENTER: Search Bar (Now visible on SM, MD, LG) */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className='flex-1 max-w-xl group cursor-text'
          >
            <div className='relative w-full'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none'>
                <Search
                  className='text-zinc-400 group-hover:text-brand-blue transition-colors'
                  size={18}
                />
              </div>
              <div className='w-full bg-zinc-100/80 border-2 border-transparent hover:border-zinc-200 rounded-2xl py-2.5 pl-11 pr-4 sm:pr-12 text-xs sm:text-sm font-bold text-zinc-400 flex items-center transition-all overflow-hidden truncate'>
                <span className='truncate'>Search terminal...</span>
              </div>
              {/* K Shortcut - Hidden on tiny screens */}
              <div className='absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-1 bg-white border border-zinc-200 rounded-md shadow-sm'>
                <Command size={10} className='text-zinc-400' />
                <span className='text-[10px] font-bold text-zinc-400'>K</span>
              </div>
            </div>
          </div>

          {/* RIGHT: User Profile (Styled for all sizes) */}
          <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
            <div className='relative'>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className='flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 hover:bg-zinc-100 rounded-2xl transition-all border border-transparent hover:border-zinc-200 group'
              >
                {/* Human Icon Avatar */}
                <div className='h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-transform group-active:scale-90'>
                  <User
                    strokeWidth={2.5}
                    className='w-5 h-5 sm:w-6 sm:h-6' // This is the correct responsive way
                  />
                </div>

                {/* Admin Name - Always visible from SM up */}
                <div className='hidden xs:block text-left max-w-20 sm:max-w-30'>
                  <p className='text-[11px] sm:text-xs font-black text-brand-slate leading-none truncate'>
                    {adminName}
                  </p>
                  <p className='text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-1'>
                    Root
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-zinc-400 transition-transform hidden sm:block',
                    isProfileOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className='absolute right-0 mt-3 w-60 bg-white border border-zinc-200 rounded-4xl shadow-2xl p-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200'>
                  <div className='px-4 py-4 border-b border-zinc-50 mb-2'>
                    <p className='text-[10px] font-black text-zinc-400 uppercase tracking-widest'>
                      Identity Verified
                    </p>
                    <p className='text-sm font-black text-brand-slate truncate mt-1'>
                      {adminName}
                    </p>
                  </div>

                  <div className='space-y-1'>
                    <button className='w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-2xl transition-colors'>
                      <ShieldCheck size={18} className='text-brand-blue' />
                      Admin Security
                    </button>
                    <button className='w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-2xl transition-colors'>
                      <Settings size={18} className='text-zinc-400' />
                      Preferences
                    </button>
                  </div>

                  <div className='h-px bg-zinc-100 my-2 mx-2' />

                  <button
                    onClick={() => {
                      localStorage.clear()
                      window.location.href = '/login'
                    }}
                    className='w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors'
                  >
                    <LogOut size={18} />
                    Exit Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}