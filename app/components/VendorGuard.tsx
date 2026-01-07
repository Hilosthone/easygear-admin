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
    const userRole = localStorage.getItem('user_role')

    // Specifically check for 'Vendor' role
    if (userRole !== 'Vendor') {
      // If not a vendor, redirect to login
      router.replace('/login')
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-10 w-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin' />
          <p className='text-xs font-black uppercase tracking-widest text-zinc-400'>
            Verifying Vendor Credentials
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}