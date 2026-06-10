'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <svg viewBox="0 0 300 200" className="w-full max-w-[300px] mx-auto" fill="none">
            {/* Background glow */}
            <circle cx="150" cy="100" r="80" fill="url(#glow404)" opacity="0.3" />
            
            {/* Broken connection line */}
            <motion.path
              d="M60 100 Q100 60 140 100 Q180 140 220 100"
              stroke="#A7F3D0"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
            />
            
            {/* Disconnected nodes */}
            <motion.circle 
              cx="60" cy="100" r="16" fill="#059669"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            <text x="60" y="104" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">4</text>
            
            <motion.circle 
              cx="150" cy="85" r="20" fill="#10B981"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <text x="150" y="89" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">0</text>
            
            <motion.circle 
              cx="240" cy="100" r="16" fill="#059669"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
            <text x="240" y="104" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">4</text>
            
            {/* Broken link indicator */}
            <motion.line 
              x1="130" y1="70" x2="110" y2="50" 
              stroke="#EF4444" strokeWidth="2" strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.line 
              x1="110" y1="70" x2="130" y2="50" 
              stroke="#EF4444" strokeWidth="2" strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
            />
            
            {/* Floating particles */}
            <motion.circle cx="40" cy="60" r="3" fill="#6EE7B7" opacity="0.6"
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
            <motion.circle cx="260" cy="70" r="2" fill="#34D399" opacity="0.5"
              animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
            <motion.circle cx="200" cy="50" r="2.5" fill="#A7F3D0" opacity="0.4"
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }} />
            
            <defs>
              <radialGradient id="glow404" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-[#18181B] mb-3">
            Connection Lost
          </h1>
          <p className="text-[#71717A] mb-8 text-base leading-relaxed">
            This knowledge node doesn&apos;t exist in your graph yet. 
            It might have been moved, deleted, or never created.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/app">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/app/graph">
              <Button variant="outline" className="border-[#E5E7EB] gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Search Knowledge Graph
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
