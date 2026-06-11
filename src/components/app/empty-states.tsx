'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Network, FileText, Sun, MessageSquare, Plus } from 'lucide-react'

// ─── Shared Animation Variants ─────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: 'easeOut',
    },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// ─── SVG Illustration Components ───────────────────────────

/** Floating graph nodes with connecting lines */
function GraphIllustration() {
  return (
    <svg
      width="260"
      height="200"
      viewBox="0 0 260 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Subtle grid dots */}
      <pattern id="empty-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="0.7" fill="rgba(5,150,105,0.08)" />
      </pattern>
      <rect width="260" height="200" fill="url(#empty-grid)" rx="12" />

      {/* Connecting lines (dashed, faint) */}
      <motion.line
        x1="80" y1="70" x2="160" y2="55"
        stroke="rgba(5,150,105,0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
      <motion.line
        x1="160" y1="55" x2="190" y2="120"
        stroke="rgba(5,150,105,0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.0 }}
      />
      <motion.line
        x1="80" y1="70" x2="120" y2="140"
        stroke="rgba(5,150,105,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.line
        x1="120" y1="140" x2="190" y2="120"
        stroke="rgba(5,150,105,0.12)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.4 }}
      />

      {/* Node: Top-left (concept) - emerald */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'backOut' }}
      >
        <motion.circle
          cx="80" cy="70" r="18"
          fill="url(#nodeGrad1)"
          stroke="rgba(5,150,105,0.2)"
          strokeWidth="2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        />
        <motion.text
          x="80" y="73"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="700"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        >
          API
        </motion.text>
      </motion.g>

      {/* Node: Top-right (project) - teal */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'backOut' }}
      >
        <motion.circle
          cx="160" cy="55" r="20"
          fill="url(#nodeGrad2)"
          stroke="rgba(13,148,136,0.2)"
          strokeWidth="2"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.text
          x="160" y="58"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          Lore
        </motion.text>
      </motion.g>

      {/* Node: Bottom-center (resource) - amber/orange */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: 'backOut' }}
      >
        <motion.circle
          cx="120" cy="140" r="16"
          fill="url(#nodeGrad3)"
          stroke="rgba(234,88,12,0.2)"
          strokeWidth="2"
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.text
          x="120" y="143"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          DB
        </motion.text>
      </motion.g>

      {/* Node: Bottom-right (idea) - violet */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease: 'backOut' }}
      >
        <motion.circle
          cx="190" cy="120" r="14"
          fill="url(#nodeGrad4)"
          stroke="rgba(124,58,237,0.2)"
          strokeWidth="2"
          animate={{ y: [0, -3.5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <motion.text
          x="190" y="123"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          animate={{ y: [0, -3.5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          Auth
        </motion.text>
      </motion.g>

      {/* Decorative floating circles */}
      <motion.circle
        cx="40" cy="130" r="4"
        fill="rgba(5,150,105,0.15)"
        animate={{ y: [0, -6, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="220" cy="45" r="3"
        fill="rgba(13,148,136,0.15)"
        animate={{ y: [0, -5, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.circle
        cx="45" cy="45" r="2.5"
        fill="rgba(124,58,237,0.12)"
        animate={{ y: [0, -4, 0], opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Gradient definitions */}
      <defs>
        <radialGradient id="nodeGrad1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
        <radialGradient id="nodeGrad2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </radialGradient>
        <radialGradient id="nodeGrad3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <radialGradient id="nodeGrad4" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/** Notebook with a pen illustration */
function NotesIllustration() {
  return (
    <svg
      width="240"
      height="200"
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Soft glow behind notebook */}
      <motion.ellipse
        cx="110" cy="130"
        rx="70" ry="12"
        fill="rgba(5,150,105,0.06)"
        animate={{ scaleX: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Notebook body */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Shadow */}
        <rect x="52" y="36" width="120" height="150" rx="8" fill="rgba(0,0,0,0.04)" />
        {/* Main notebook */}
        <rect x="48" y="30" width="120" height="150" rx="8" fill="white" stroke="rgba(5,150,105,0.2)" strokeWidth="1.5" />
        {/* Spine line */}
        <rect x="48" y="30" width="8" height="150" rx="4" fill="rgba(5,150,105,0.08)" />
        {/* Ruled lines */}
        {[62, 82, 102, 122, 142].map((y, i) => (
          <motion.line
            key={y}
            x1="66" y1={y} x2="155" y2={y}
            stroke="rgba(5,150,105,0.1)"
            strokeWidth="1"
            strokeDasharray={i < 2 ? '0' : '2 2'}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
          />
        ))}
        {/* Text placeholders */}
        <motion.rect
          x="66" y="56" width="60" height="4" rx="2" fill="rgba(5,150,105,0.25)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.rect
          x="66" y="76" width="75" height="4" rx="2" fill="rgba(5,150,105,0.15)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.rect
          x="66" y="96" width="50" height="4" rx="2" fill="rgba(5,150,105,0.1)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.g>

      {/* Pen */}
      <motion.g
        initial={{ opacity: 0, rotate: -20, x: -10 }}
        animate={{ opacity: 1, rotate: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      >
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Pen body */}
          <rect x="168" y="55" width="8" height="90" rx="3" fill="url(#penGrad)" stroke="rgba(5,150,105,0.3)" strokeWidth="0.5" />
          {/* Pen tip */}
          <polygon points="170,145 174,145 172,155" fill="#059669" />
          {/* Pen cap ring */}
          <rect x="167" y="55" width="10" height="6" rx="2" fill="rgba(5,150,105,0.4)" />
          {/* Pen clip */}
          <rect x="175" y="50" width="2" height="20" rx="1" fill="rgba(5,150,105,0.3)" />
        </motion.g>
      </motion.g>

      {/* Sparkles around notebook */}
      <motion.circle
        cx="42" cy="38" r="2.5"
        fill="rgba(5,150,105,0.2)"
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="175" cy="35" r="2"
        fill="rgba(13,148,136,0.2)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.circle
        cx="160" cy="170" r="1.8"
        fill="rgba(5,150,105,0.15)"
        animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <defs>
        <linearGradient id="penGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Sunrise / morning scene illustration */
function SunriseIllustration() {
  return (
    <svg
      width="280"
      height="200"
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(251,191,36,0.08)" />
          <stop offset="50%" stopColor="rgba(251,146,60,0.05)" />
          <stop offset="100%" stopColor="rgba(5,150,105,0.03)" />
        </linearGradient>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
          <stop offset="100%" stopColor="rgba(251,191,36,0)" />
        </radialGradient>
      </defs>

      <rect width="280" height="200" rx="12" fill="url(#skyGrad)" />

      {/* Horizon line */}
      <motion.line
        x1="30" y1="140" x2="250" y2="140"
        stroke="rgba(5,150,105,0.1)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />

      {/* Sun glow */}
      <motion.circle
        cx="140" cy="140" r="50"
        fill="url(#sunGlow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sun rising */}
      <motion.g
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
      >
        <motion.circle
          cx="140" cy="125" r="24"
          fill="url(#sunGrad)"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 140 + Math.cos(rad) * 30
        const y1 = 125 + Math.sin(rad) * 30
        const x2 = 140 + Math.cos(rad) * 42
        const y2 = 125 + Math.sin(rad) * 42
        return (
          <motion.line
            key={angle}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(251,191,36,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0.3] }}
            transition={{
              pathLength: { duration: 0.6, delay: 0.5 + i * 0.08 },
              opacity: { duration: 2, delay: 0.5 + i * 0.08, repeat: Infinity, repeatType: 'reverse' },
            }}
          />
        )
      })}

      {/* Hills/mountains in background */}
      <motion.path
        d="M0 160 Q40 130 80 150 Q120 135 160 148 Q200 128 240 145 Q260 140 280 160 L280 200 L0 200 Z"
        fill="rgba(5,150,105,0.06)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      <motion.path
        d="M0 170 Q60 150 100 165 Q140 155 180 168 Q220 152 280 170 L280 200 L0 200 Z"
        fill="rgba(5,150,105,0.04)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      />

      {/* Small clouds */}
      <motion.g
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="60" cy="60" rx="20" ry="8" fill="rgba(255,255,255,0.5)" />
        <ellipse cx="52" cy="57" rx="12" ry="6" fill="rgba(255,255,255,0.4)" />
        <ellipse cx="70" cy="58" rx="10" ry="5" fill="rgba(255,255,255,0.35)" />
      </motion.g>

      <motion.g
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <ellipse cx="210" cy="50" rx="16" ry="6" fill="rgba(255,255,255,0.4)" />
        <ellipse cx="204" cy="47" rx="10" ry="5" fill="rgba(255,255,255,0.3)" />
      </motion.g>

      {/* Morning dew drops / decorative sparkles */}
      <motion.circle cx="50" cy="170" r="2" fill="rgba(5,150,105,0.15)"
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle cx="230" cy="165" r="1.5" fill="rgba(251,191,36,0.2)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </svg>
  )
}

/** Brain / AI spark illustration */
function ChatIllustration() {
  return (
    <svg
      width="240"
      height="200"
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(5,150,105,0.12)" />
          <stop offset="100%" stopColor="rgba(5,150,105,0)" />
        </radialGradient>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <motion.circle
        cx="120" cy="90" r="60"
        fill="url(#brainGlow)"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Brain outline */}
      <motion.path
        d="M95 85 Q90 60 105 55 Q115 50 120 55 Q125 50 135 55 Q150 60 145 85 Q148 95 142 105 Q135 118 120 120 Q105 118 98 105 Q92 95 95 85 Z"
        stroke="url(#brainGrad)"
        strokeWidth="2"
        fill="rgba(5,150,105,0.04)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
      />

      {/* Brain center line */}
      <motion.path
        d="M120 57 Q120 85 120 118"
        stroke="rgba(5,150,105,0.15)"
        strokeWidth="1"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />

      {/* Brain neural connections */}
      <motion.path
        d="M105 75 Q112 80 120 75 Q128 70 135 75"
        stroke="rgba(5,150,105,0.2)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      />
      <motion.path
        d="M100 90 Q110 95 120 90 Q130 85 140 90"
        stroke="rgba(5,150,105,0.15)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      />
      <motion.path
        d="M105 103 Q112 107 120 103 Q128 99 135 103"
        stroke="rgba(5,150,105,0.12)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      />

      {/* Neural nodes on brain */}
      {[
        { cx: 105, cy: 75, delay: 0.6 },
        { cx: 135, cy: 75, delay: 0.7 },
        { cx: 100, cy: 90, delay: 0.8 },
        { cx: 140, cy: 90, delay: 0.9 },
        { cx: 108, cy: 103, delay: 1.0 },
        { cx: 132, cy: 103, delay: 1.1 },
        { cx: 120, cy: 65, delay: 0.5 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="2.5"
          fill="#059669"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: [0, 0.7, 0.5] }}
          transition={{
            scale: { duration: 0.3, delay: node.delay, ease: 'backOut' },
            opacity: { duration: 2, delay: node.delay, repeat: Infinity, repeatType: 'reverse' },
          }}
        />
      ))}

      {/* AI Spark / lightning bolt */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5, ease: 'backOut' }}
      >
        <motion.g
          animate={{ y: [0, -4, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M158 42 L152 58 L162 55 L154 75"
            stroke="url(#sparkGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </motion.g>

      {/* Orbiting particles */}
      <motion.circle
        cx="70" cy="60" r="3" fill="rgba(5,150,105,0.2)"
        animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="172" cy="110" r="2.5" fill="rgba(13,148,136,0.2)"
        animate={{ y: [0, -5, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.circle
        cx="65" cy="120" r="2" fill="rgba(124,58,237,0.15)"
        animate={{ y: [0, -4, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Connection lines to spark */}
      <motion.line
        x1="145" y1="85" x2="155" y2="55"
        stroke="rgba(251,191,36,0.15)"
        strokeWidth="1"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      />
    </svg>
  )
}

// ─── CTA Button Component ──────────────────────────────────
function EmeraldButton({
  label,
  onClick,
  icon: BtnIcon,
}: {
  label: string
  onClick?: () => void
  icon?: LucideIcon
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        bg-gradient-to-r from-emerald-500 to-emerald-700
        hover:from-emerald-600 hover:to-emerald-800
        text-white text-sm font-semibold
        shadow-lg shadow-emerald-500/25
        hover:shadow-xl hover:shadow-emerald-500/30
        active:scale-[0.97]
        transition-all duration-200
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {BtnIcon && <BtnIcon className="w-4 h-4" />}
      {label}
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════════════════
// LORE EMPTY STATE — Generic, Reusable
// ═══════════════════════════════════════════════════════════════
interface LoreEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  illustration?: 'graph' | 'notes' | 'chat' | 'digest'
}

export function LoreEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}: LoreEmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {/* SVG Illustration */}
      {illustration && (
        <motion.div variants={fadeIn} className="mb-6">
          {illustration === 'graph' && <GraphIllustration />}
          {illustration === 'notes' && <NotesIllustration />}
          {illustration === 'digest' && <SunriseIllustration />}
          {illustration === 'chat' && <ChatIllustration />}
        </motion.div>
      )}

      {/* Icon circle (shown when no illustration) */}
      {!illustration && (
        <motion.div
          variants={scaleIn}
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-5
            bg-gradient-to-br from-emerald-50 to-teal-50
            border border-emerald-100/60
            shadow-sm
          `}
        >
          <Icon className="w-7 h-7 text-emerald-600" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        variants={fadeInUp}
        className="text-xl font-bold text-[#18181B] mb-2 tracking-tight"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-sm text-[#71717A] max-w-md leading-relaxed mb-6"
      >
        {description}
      </motion.p>

      {/* CTA Button */}
      {actionLabel && onAction && (
        <motion.div variants={fadeInUp}>
          <EmeraldButton label={actionLabel} onClick={onAction} />
        </motion.div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// GRAPH EMPTY STATE
// ═══════════════════════════════════════════════════════════════
interface GraphEmptyStateProps {
  onAddNode?: () => void
}

export function GraphEmptyState({ onAddNode }: GraphEmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Illustration */}
      <motion.div variants={fadeIn} className="mb-8">
        <GraphIllustration />
      </motion.div>

      {/* Icon + Title row */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <Network className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-[#18181B] tracking-tight">
          Start building your knowledge graph
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-sm text-[#71717A] max-w-lg leading-relaxed mb-8"
      >
        Add your first knowledge node to begin mapping your team&apos;s collective memory.
        Each node represents a concept, decision, or resource.
      </motion.p>

      {/* CTA */}
      <motion.div variants={fadeInUp}>
        <EmeraldButton
          label="Add Your First Node"
          onClick={onAddNode}
          icon={Plus}
        />
      </motion.div>

      {/* Decorative floating circles */}
      <div className="relative w-full max-w-md mt-4 h-8">
        <motion.div
          className="absolute left-[15%] top-2 w-3 h-3 rounded-full bg-emerald-200/50"
          animate={{ y: [0, -6, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[50%] top-3 w-2.5 h-2.5 rounded-full bg-teal-200/50"
          animate={{ y: [0, -5, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute left-[80%] top-1 w-2 h-2 rounded-full bg-emerald-300/40"
          animate={{ y: [0, -7, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// NOTES EMPTY STATE
// ═══════════════════════════════════════════════════════════════
interface NotesEmptyStateProps {
  onCreateNote?: () => void
}

export function NotesEmptyState({ onCreateNote }: NotesEmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Illustration */}
      <motion.div variants={fadeIn} className="mb-8">
        <NotesIllustration />
      </motion.div>

      {/* Icon + Title row */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-[#18181B] tracking-tight">
          Capture your first memory
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-sm text-[#71717A] max-w-lg leading-relaxed mb-8"
      >
        Notes are the building blocks of your knowledge. Capture insights, meeting notes,
        bookmarks, and ideas — all in one place.
      </motion.p>

      {/* CTA */}
      <motion.div variants={fadeInUp}>
        <EmeraldButton
          label="Create Your First Note"
          onClick={onCreateNote}
          icon={Plus}
        />
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DIGEST EMPTY STATE
// ═══════════════════════════════════════════════════════════════
export function DigestEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Illustration */}
      <motion.div variants={fadeIn} className="mb-8">
        <SunriseIllustration />
      </motion.div>

      {/* Icon + Title row */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Sun className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-[#18181B] tracking-tight">
          Your morning digest awaits
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-sm text-[#71717A] max-w-lg leading-relaxed mb-6"
      >
        Add some knowledge nodes to generate your first AI-powered morning digest.
        It summarizes changes and highlights connections you might have missed.
      </motion.p>

      {/* Subtle hint (no action button) */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9FAFB] border border-[#E5E7EB]"
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-amber-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-xs text-[#71717A] font-medium">
          Add nodes to your graph to unlock daily digests
        </span>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CHAT EMPTY STATE
// ═══════════════════════════════════════════════════════════════
interface ChatEmptyStateProps {
  onSuggestionClick?: (suggestion: string) => void
}

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  const suggestions = [
    'What are my key concepts?',
    'Show recent changes',
    'Find connections',
    'Summarize my knowledge',
  ]

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {/* Illustration */}
      <motion.div variants={fadeIn} className="mb-6">
        <ChatIllustration />
      </motion.div>

      {/* Icon + Title row */}
      <motion.div variants={fadeInUp} className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-[#18181B] tracking-tight">
          Ask your knowledge graph
        </h3>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeInUp}
        className="text-sm text-[#71717A] max-w-md leading-relaxed mb-6"
      >
        Start a conversation with your data. Ask questions, explore connections,
        and get AI-powered insights from your knowledge base.
      </motion.p>

      {/* Suggestion chips */}
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            variants={fadeInUp}
            onClick={() => onSuggestionClick?.(suggestion)}
            className={`
              text-left px-4 py-3 rounded-xl
              border border-[#E5E7EB] bg-white
              hover:border-emerald-200 hover:bg-emerald-50/40
              hover:shadow-sm
              transition-all duration-200
              text-xs text-[#52525B] font-medium
              group
            `}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors shrink-0" />
              {suggestion}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}
