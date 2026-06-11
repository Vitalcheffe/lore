'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingBar() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsNavigating(true)
      setPrevPathname(pathname)
      
      // Simulate loading complete after a brief delay
      const timer = setTimeout(() => {
        setIsNavigating(false)
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-[100] origin-left"
          style={{ boxShadow: '0 0 10px rgba(5, 150, 105, 0.5)' }}
        />
      )}
    </AnimatePresence>
  )
}
