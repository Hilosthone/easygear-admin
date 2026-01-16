'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Safety check for client-side execution
    if (typeof window === 'undefined') return

    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('easygear_token')

    // 1. If no user or no token, redirect to login immediately
    if (!savedUser || !token) {
      router.replace('/login')
      return
    }

    try {
      const user = JSON.parse(savedUser)

      /**
       * 2. Strict Role Check
       * Based on your backend, 'System Root' is the top-level admin.
       */
      if (user.role === 'System Root') {
        setAuthorized(true)
      } else {
        // Redirect unauthorized users to the vendor portal
        router.replace('/vendor')
      }
    } catch (error) {
      // Clear corrupted data and boot to login
      localStorage.removeItem('user')
      localStorage.removeItem('easygear_token')
      router.replace('/login')
    }
  }, [router])

  // Show a clean loading state while verifying credentials
  if (!authorized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin' />
          <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
            Verifying Terminal Authority...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}