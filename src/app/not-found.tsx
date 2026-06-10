'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Home, Search, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── Floating node keyframes ── */
const driftStyles = `
@keyframes drift1 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(14px,-18px) } 50%{ transform: translate(-10px,12px) } 75%{ transform: translate(18px,8px) } }
@keyframes drift2 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(-16px,10px) } 50%{ transform: translate(12px,-14px) } 75%{ transform: translate(-8px,-18px) } }
@keyframes drift3 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(10px,16px) } 50%{ transform: translate(-18px,-8px) } 75%{ transform: translate(14px,-12px) } }
@keyframes drift4 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(-12px,-16px) } 50%{ transform: translate(16px,14px) } 75%{ transform: translate(-14px,10px) } }
@keyframes drift5 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(18px,6px) } 50%{ transform: translate(-14px,-16px) } 75%{ transform: translate(10px,14px) } }
@keyframes drift6 { 0%,100%{ transform: translate(0,0) } 25%{ transform: translate(-8px,18px) } 50%{ transform: translate(18px,-10px) } 75%{ transform: translate(-16px,-6px) } }
@keyframes pulse-ring { 0%{ opacity:.35; transform:scale(1) } 50%{ opacity:.08; transform:scale(1.6) } 100%{ opacity:.35; transform:scale(1) } }
`

interface GraphNode {
  cx: number
  cy: number
  r: number
  fill: string
  opacity: number
  label: string
  fontSize: number
  drift: string
  duration: string
}

const nodes: GraphNode[] = [
  { cx: 70, cy: 55, r: 16, fill: '#10B981', opacity: 0.9, label: 'API', fontSize: 8, drift: 'drift1', duration: '8s' },
  { cx: 170, cy: 85, r: 20, fill: '#059669', opacity: 0.95, label: 'Core', fontSize: 9, drift: 'drift2', duration: '9s' },
  { cx: 270, cy: 50, r: 14, fill: '#34D399', opacity: 0.8, label: 'DB', fontSize: 7, drift: 'drift3', duration: '7.5s' },
  { cx: 110, cy: 150, r: 15, fill: '#0D9488', opacity: 0.85, label: 'Auth', fontSize: 7, drift: 'drift4', duration: '10s' },
  { cx: 230, cy: 145, r: 12, fill: '#14B8A6', opacity: 0.75, label: 'AI', fontSize: 6, drift: 'drift5', duration: '8.5s' },
  { cx: 190, cy: 30, r: 11, fill: '#6EE7B7', opacity: 0.7, label: 'ML', fontSize: 6, drift: 'drift6', duration: '9.5s' },
]

/* Disconnected edges — they don't quite reach the nodes */
const edges = [
  { x1: 82, y1: 62, x2: 155, y2: 80, opacity: 0.15 },
  { x1: 185, y1: 82, x2: 258, y2: 56, opacity: 0.12 },
  { x1: 160, y1: 95, x2: 120, y2: 140, opacity: 0.1 },
  { x1: 180, y1: 95, x2: 222, y2: 138, opacity: 0.08 },
  { x1: 178, y1: 72, x2: 185, y2: 38, opacity: 0.1 },
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFC] px-4 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: driftStyles }} />

      {/* Background floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400/10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -(Math.random() * 40 + 10), 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* Broken Knowledge Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 w-full max-w-xs mx-auto"
        >
          <svg viewBox="0 0 340 190" className="w-full h-auto" fill="none">
            {/* Disconnected edges */}
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity={e.opacity}
              />
            ))}

            {/* Drifting nodes */}
            {nodes.map((n, i) => (
              <g key={i} style={{ animation: `${n.drift} ${n.duration} ease-in-out infinite` }}>
                {/* Pulse ring */}
                <circle
                  cx={n.cx} cy={n.cy} r={n.r + 6}
                  fill="none"
                  stroke={n.fill}
                  strokeWidth="1"
                  opacity="0.25"
                  style={{ animation: 'pulse-ring 3s ease-in-out infinite', animationDelay: `${i * 0.4}s` }}
                />
                {/* Node */}
                <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} opacity={n.opacity} />
                <text x={n.cx} y={n.cy + n.fontSize / 3} textAnchor="middle" fill="white" fontSize={n.fontSize} fontWeight="600">
                  {n.label}
                </text>
              </g>
            ))}

            {/* Broken connection indicators — small X marks */}
            <g opacity="0.3">
              <text x="120" y="78" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle">✕</text>
              <text x="220" y="75" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle">✕</text>
              <text x="145" y="125" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle">✕</text>
            </g>
          </svg>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1
            className="text-8xl sm:text-9xl font-black leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #0D9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-4 text-lg sm:text-xl text-[#475569] font-medium leading-relaxed"
        >
          This knowledge hasn&apos;t been discovered yet
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-2 text-sm text-gray-400 max-w-sm"
        >
          The page you&apos;re looking for seems to have disconnected from the knowledge graph. Let&apos;s reconnect you.
        </motion.p>

        {/* Recovery Options */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full"
        >
          <Button
            asChild
            className="h-11 px-6 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Link href="/app">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 px-6 rounded-xl text-sm font-semibold border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Link href="/app?search=true">
              <Search className="w-4 h-4 mr-2" />
              Search Knowledge
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-11 px-6 rounded-xl text-sm font-medium text-[#475569] hover:text-[#0F172A] hover:bg-gray-100 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex items-center gap-2 text-gray-300"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold tracking-tight text-gray-400">LORE</span>
        </motion.div>
      </div>
    </div>
  )
}
