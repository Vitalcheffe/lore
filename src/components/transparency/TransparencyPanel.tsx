'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Layers, TrendingUp, Database, Scale, Cpu, Eye, ShieldCheck } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { TransparencyLayer } from '@/types/classification'
import { ConfidenceScore } from './ConfidenceScore'
import { SourceQuality } from './SourceQuality'
import { BiasCheck } from './BiasCheck'
import { ComplexityLevel } from './ComplexityLevel'
import { AlternativeViews } from './AlternativeViews'
import { VerificationStatus } from './VerificationStatus'

interface TransparencyPanelProps {
  layers: TransparencyLayer
}

const tabConfig = [
  { value: 'confidence', label: 'Confidence', icon: TrendingUp },
  { value: 'source', label: 'Source', icon: Database },
  { value: 'bias', label: 'Bias', icon: Scale },
  { value: 'complexity', label: 'Complexity', icon: Cpu },
  { value: 'alternatives', label: 'Alternatives', icon: Eye },
  { value: 'verification', label: 'Verification', icon: ShieldCheck },
]

export function TransparencyPanel({ layers }: TransparencyPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('confidence')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
    >
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white/70" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white/90">Transparency Layers</h3>
            <p className="text-[11px] text-white/40 mt-0.5">
              6 layers of calibrated transparency
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-white/40"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full h-auto flex-wrap gap-1 bg-white/5 p-1.5 rounded-xl">
                  {tabConfig.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex-1 min-w-0 px-2 py-2 text-[11px] sm:text-xs gap-1 data-[state=active]:bg-white/10 data-[state=active]:text-white/90 text-white/40 rounded-lg"
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {/* Tab content */}
                <div className="mt-4 min-h-[200px]">
                  <TabsContent value="confidence" className="mt-0">
                    <ConfidenceScore confidence={layers.confidence} />
                  </TabsContent>

                  <TabsContent value="source" className="mt-0">
                    <SourceQuality sourceQuality={layers.sourceQuality} score={layers.sourceQualityScore} />
                  </TabsContent>

                  <TabsContent value="bias" className="mt-0">
                    <BiasCheck biasCheck={layers.biasCheck} />
                  </TabsContent>

                  <TabsContent value="complexity" className="mt-0">
                    <ComplexityLevel complexity={layers.complexity} explanation={layers.complexityExplanation} />
                  </TabsContent>

                  <TabsContent value="alternatives" className="mt-0">
                    <AlternativeViews alternatives={layers.alternatives} />
                  </TabsContent>

                  <TabsContent value="verification" className="mt-0">
                    <VerificationStatus verification={layers.verification} lastVerified={layers.lastVerified} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TransparencyPanel
