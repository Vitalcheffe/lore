import { create } from 'zustand'
import { Achievement } from '@/components/app/achievements'

interface AchievementState {
  currentAchievement: Achievement | null
  triggeredIds: Set<string>
  triggerAchievement: (achievement: Achievement) => void
  clearAchievement: () => void
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  currentAchievement: null,
  triggeredIds: new Set<string>(),
  triggerAchievement: (achievement: Achievement) => {
    const { triggeredIds } = get()
    // Only show each achievement once per session
    if (triggeredIds.has(achievement.id)) return
    set({
      currentAchievement: achievement,
      triggeredIds: new Set([...triggeredIds, achievement.id]),
    })
  },
  clearAchievement: () => set({ currentAchievement: null }),
}))
