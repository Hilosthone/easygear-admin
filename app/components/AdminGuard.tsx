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
    // Check if the user has a valid session in localStorage
    const userRole = localStorage.getItem('user_role')
    const userName = localStorage.getItem('user_name')

    if (!userRole || !userName) {
      // If no session, boot them back to login
      router.replace('/login')
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    // Optional: A branded loading screen while checking auth
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='h-8 w-8 border-4 border-brand-blue border-t-brand-orange rounded-full animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}