'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      if (hash.includes('type=recovery')) {
        router.push('/reset-password' + hash)
      } else if (hash.includes('error_code=otp_expired')) {
        alert('This reset link has expired or has already been used. Please request a new one from the dashboard.')
        window.location.hash = '' // Clear the hash
      }
    }
  }, [router])

  return null
}
