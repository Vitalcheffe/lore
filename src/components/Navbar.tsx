'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Brain } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-bg-scrolled' : 'navbar-bg'} ${!scrolled ? 'border-b border-transparent' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA]">LORE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link text-sm font-medium text-[#475569] dark:text-[#A1A1AA] px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[#475569] dark:text-[#A1A1AA] hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-50/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex btn-primary text-sm h-10 px-5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#18181B]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="md:hidden overflow-hidden navbar-mobile-border"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-left text-sm font-medium py-2.5 px-3 rounded-lg text-[#475569] dark:text-[#A1A1AA] hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 px-3 flex flex-col gap-2">
                  <Link href="/login" className="w-full text-center text-sm font-medium py-2.5 rounded-lg text-[#475569] dark:text-[#A1A1AA] hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-primary w-full justify-center text-sm h-11" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
