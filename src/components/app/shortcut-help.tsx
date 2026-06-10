'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShortcutCategory {
  name: string
  shortcuts: { keys: string; description: string }[]
}

const shortcutCategories: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { keys: '⌘ K', description: 'Open command palette' },
      { keys: '⌘ D', description: 'Go to Dashboard' },
      { keys: '⌘ G', description: 'Go to Knowledge Graph' },
      { keys: '⌘ M', description: 'Go to Morning Digest' },
      { keys: '⌘ N', description: 'Go to Memory / Notes' },
      { keys: '⌘ T', description: 'Go to Team' },
      { keys: '⌘ S', description: 'Go to Settings' },
    ],
  },
  {
    name: 'Actions',
    shortcuts: [
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: 'Esc', description: 'Close dialog / modal' },
      { keys: '⌘ /', description: 'Toggle sidebar' },
    ],
  },
  {
    name: 'Knowledge Graph',
    shortcuts: [
      { keys: '1', description: 'Select mode' },
      { keys: '2', description: 'Add node mode' },
      { keys: '3', description: 'Add edge mode' },
      { keys: '4', description: 'Delete mode' },
      { keys: 'Del', description: 'Delete selected' },
    ],
  },
]

export function ShortcutHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Open on "?" key (not in input/textarea)
    if (
      e.key === '?' &&
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    // Close on Escape
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg max-h-[80vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Keyboard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-bold text-[#18181B]">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#52525B] hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-6">
                {shortcutCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-3">
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      {category.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.keys}
                          className="flex items-center justify-between py-1.5"
                        >
                          <span className="text-sm text-[#52525B]">
                            {shortcut.description}
                          </span>
                          <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#18181B] bg-[#F3F4F6] border border-[#E5E7EB] rounded-md font-mono">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <p className="text-xs text-[#A1A1AA] text-center">
                  Press <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-[#E5E7EB] rounded font-mono">?</kbd> anytime to toggle this panel
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
