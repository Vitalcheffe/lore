'use client'

import Link from 'next/link'
import { Brain, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'Dashboard', href: '/app' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'API Reference', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F172A]" style={{ marginTop: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">LORE</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
              Your team&apos;s shared memory — structured, consistent, and available everywhere. Powered by Aurora DSQL.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold tracking-wider uppercase text-gray-300 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 Lore. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Built on Aurora DSQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
