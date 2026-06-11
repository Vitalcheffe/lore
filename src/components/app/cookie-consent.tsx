'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('lore-cookie-consent')
    if (!consent) {
      // Show banner after a brief delay
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('lore-cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('lore-cookie-consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#0F0F12] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[rgba(245,158,11,0.10)] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-1">We respect your privacy</p>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  We use essential cookies to keep Lore running and optional cookies to improve your experience. 
                  No data is sold to third parties.{' '}
                  <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex-1 sm:flex-none"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="text-xs bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 flex-1 sm:flex-none"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
