
// This file can be deleted - using pages/contracts/[id].tsx instead

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Contract() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the Next.js implementation
    if (router.isReady) {
      const { id } = router.query
      router.replace(`/contracts/${id}`)
    }
  }, [router])
  
  return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p>Redirecting to contract details...</p>
    </div>
  )
}
