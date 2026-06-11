'use client'

import { Component, ReactNode } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="error-ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center min-h-[60vh] p-8"
          >
            <div className="text-center max-w-md w-full">
              {/* SVG Illustration — broken puzzle / connection */}
              <div className="mx-auto mb-6 w-24 h-24 relative">
                <svg
                  viewBox="0 0 96 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Background circle */}
                  <circle cx="48" cy="48" r="44" fill="#FEF2F2" />
                  <circle cx="48" cy="48" r="44" stroke="#FECACA" strokeWidth="1" fill="none" />
                  {/* Puzzle piece left */}
                  <path
                    d="M28 42C28 42 28 34 34 34C36.5 34 37 36 37 36C37 36 37.5 34 40 34C46 34 46 42 46 42"
                    stroke="#F87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Puzzle piece right — offset to show break */}
                  <path
                    d="M50 42C50 42 50 34 56 34C58.5 34 59 36 59 36C59 36 59.5 34 62 34C68 34 68 42 68 42"
                    stroke="#F87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Connection line — broken */}
                  <line x1="36" y1="52" x2="44" y2="52" stroke="#FECACA" strokeWidth="2" strokeLinecap="round" />
                  <line x1="52" y1="52" x2="60" y2="52" stroke="#FECACA" strokeWidth="2" strokeLinecap="round" />
                  {/* Dots at break */}
                  <circle cx="46" cy="52" r="1.5" fill="#FCA5A5" />
                  <circle cx="50" cy="52" r="1.5" fill="#FCA5A5" />
                  {/* Bottom puzzle piece */}
                  <path
                    d="M40 56C40 56 40 62 44 62C46 62 46 60 48 60C50 60 50 62 52 62C56 62 56 56 56 56"
                    stroke="#F87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Subtle emerald accent dot */}
                  <circle cx="48" cy="48" r="3" fill="#34D399" opacity="0.6" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#18181B] mb-2">
                Something went wrong
              </h2>

              {/* Description */}
              <p className="text-sm text-[#71717A] mb-6 leading-relaxed">
                An unexpected error occurred. Don&apos;t worry, your data is safe.
              </p>

              {/* Collapsible error details */}
              {this.state.error && (
                <details className="mb-6 text-left group">
                  <summary className="text-xs text-[#A1A1AA] cursor-pointer hover:text-[#71717A] transition-colors select-none flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Error details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-red-600 overflow-auto max-h-32 border border-gray-100">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="gap-2 border-[#E4E4E7] hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Link href="/app">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white gap-2 hover:from-emerald-600 hover:to-emerald-800 shadow-sm shadow-emerald-200">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )
    }

    return this.props.children
  }
}
