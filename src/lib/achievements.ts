import { ACHIEVEMENTS, Achievement } from '@/components/app/achievements'

export function checkAchievements(stats: {
  nodeCount: number
  edgeCount: number
  noteCount: number
  chatCount: number
  streak: number
}): Achievement[] {
  const unlocked: Achievement[] = []
  
  if (stats.nodeCount >= 1) unlocked.push(ACHIEVEMENTS.first_node)
  if (stats.nodeCount >= 5) unlocked.push(ACHIEVEMENTS.five_nodes)
  if (stats.nodeCount >= 10) unlocked.push(ACHIEVEMENTS.ten_nodes)
  if (stats.edgeCount >= 1) unlocked.push(ACHIEVEMENTS.first_edge)
  if (stats.noteCount >= 1) unlocked.push(ACHIEVEMENTS.first_note)
  if (stats.chatCount >= 1) unlocked.push(ACHIEVEMENTS.first_chat)
  if (stats.streak >= 3) unlocked.push(ACHIEVEMENTS.streak_3)
  
  return unlocked
}
