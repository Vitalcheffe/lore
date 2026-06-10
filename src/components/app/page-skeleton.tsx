'use client'

import { Skeleton } from '@/components/ui/skeleton'

// ═══════════════════════════════════════════════════════════════
// LORE — Page Loading Skeletons
// Reusable animated skeleton components for each app page type
// ═══════════════════════════════════════════════════════════════

export type PageSkeletonVariant = 'dashboard' | 'graph' | 'chat' | 'memory' | 'digest' | 'settings' | 'team'

interface PageSkeletonProps {
  variant?: PageSkeletonVariant
}

// ─── Shared Sub-Components ──────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-3.5 h-3.5 rounded-full" />
      </div>
      <Skeleton className="h-7 w-16 mb-1" />
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-20 mt-2" />
    </div>
  )
}

function ContentRowSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Variant Skeletons ──────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-56 mb-1" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Profile completion card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-2 w-full max-w-md rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Two content rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentRowSkeleton />
        <ContentRowSkeleton />
      </div>

      {/* Recent activity + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContentRowSkeleton />
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <Skeleton className="h-4 w-28 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB]">
                <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-32" />
                </div>
                <Skeleton className="w-3.5 h-3.5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Left toolbar */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 bg-white/90 border border-[#E5E7EB] rounded-xl p-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="w-9 h-9 rounded-lg" />
          ))}
        </div>

        {/* Large canvas area */}
        <Skeleton className="w-full h-full" />

        {/* Zoom indicator */}
        <div className="absolute bottom-3 left-3 z-20">
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>

        {/* Right panel */}
        <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white border-l border-[#E5E7EB] p-4 hidden lg:block">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatSkeleton() {
  return (
    <div className="h-full flex bg-white">
      {/* Sidebar list */}
      <div className="hidden md:flex w-[280px] border-r border-[#E5E7EB] flex-col">
        <div className="p-3 border-b border-[#E5E7EB]">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex-1 p-2 space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 rounded-xl">
              <Skeleton className="h-4 w-3/4 mb-1.5" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? 'items-end' : ''}`}>
                <Skeleton className="h-20 w-64 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function MemorySkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Skeleton className="h-9 w-full sm:max-w-md rounded-lg" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-7 w-14 rounded-lg" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Categories sidebar */}
        <div className="hidden md:flex w-[220px] shrink-0 border-r border-[#E5E7EB] bg-white flex-col p-4">
          <Skeleton className="h-3 w-20 mb-3" />
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Grid of cards */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="w-3.5 h-3.5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-5/6 mb-3" />
                <div className="flex gap-1.5 mb-3">
                  <Skeleton className="h-5 w-12 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-10 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] mt-auto">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DigestSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-7 w-44 mb-1" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        {/* Main layout: content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Key insights */}
            <div>
              <Skeleton className="h-4 w-28 mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                    <Skeleton className="w-9 h-9 rounded-lg mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <Skeleton className="h-4 w-40 mb-3" />
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="w-[30px] h-[30px] rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-2.5 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <div>
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl bg-[#F9FAFB] p-3 text-center border border-[#F3F4F6]">
                      <Skeleton className="w-4 h-4 rounded mx-auto mb-1.5" />
                      <Skeleton className="h-5 w-8 mx-auto mb-1" />
                      <Skeleton className="h-2.5 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action items */}
            <div>
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-4 h-4 rounded shrink-0" />
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <div>
            <Skeleton className="h-7 w-24 mb-1" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section nav */}
        <div className="lg:w-[240px] shrink-0">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2">
            <div className="space-y-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            {/* Avatar section */}
            <div className="flex items-center gap-5">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            {/* Form fields */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}

            {/* Save button */}
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1280px] mx-auto space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Members table */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-36" />
                    </div>
                    <Skeleton className="h-5 w-14 rounded-lg" />
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pending invitations */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="p-5 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Team settings card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-3.5 w-28" />
                    </div>
                    <Skeleton className="w-7 h-7 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Roles card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Skeleton className="w-7 h-7 rounded-lg" />
                      <div>
                        <Skeleton className="h-3 w-14 mb-0.5" />
                        <Skeleton className="h-2 w-20" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[1, 2].map((j) => (
                        <Skeleton key={j} className="h-2.5 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton Variant Map ───────────────────────────────────

const skeletonMap: Record<PageSkeletonVariant, () => JSX.Element> = {
  dashboard: DashboardSkeleton,
  graph: GraphSkeleton,
  chat: ChatSkeleton,
  memory: MemorySkeleton,
  digest: DigestSkeleton,
  settings: SettingsSkeleton,
  team: TeamSkeleton,
}

// ─── Main Export ────────────────────────────────────────────

export function PageSkeleton({ variant = 'dashboard' }: PageSkeletonProps) {
  const SkeletonComponent = skeletonMap[variant] || DashboardSkeleton
  return <SkeletonComponent />
}
