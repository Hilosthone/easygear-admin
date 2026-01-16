'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VendorGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('easygear_token')

    // 1. Check for basic session data
    if (!savedUser || !token) {
      router.replace('/login')
      return
    }

    try {
      const user = JSON.parse(savedUser)

      /**
       * 2. Role Check
       * Note: Ensure this matches the string returned by your API.
       * If your API returns 'Vendor' (capitalized), update this check.
       */
      if (user.role?.toLowerCase() === 'vendor') {
        setAuthorized(true)
      } else {
        // If an Admin accidentally tries to go to the Vendor portal, redirect to Admin
        router.replace('/admin')
      }
    } catch (error) {
      localStorage.removeItem('user')
      localStorage.removeItem('easygear_token')
      router.replace('/login')
    }
  }, [router])

  if (!authorized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin' />
          <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
            Accessing Vendor Portal...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
