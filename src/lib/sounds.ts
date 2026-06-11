// Simple notification sounds using Web Audio API
// No external files needed - sounds are generated programmatically

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('lore-sound-enabled')
  // Default to enabled if not set
  return stored === null ? true : stored === 'true'
}

export function playNotificationSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  } catch {
    // Audio not supported, silently ignore
  }
}

export function playSuccessSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(523, ctx.currentTime) // C5
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2) // G5
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.4)
  } catch {
    // Audio not supported, silently ignore
  }
}

export function playAchievementSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()

    // Play a triumphant ascending arpeggio
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      const startTime = ctx.currentTime + i * 0.1
      gainNode.gain.setValueAtTime(0.06, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  } catch {
    // Audio not supported, silently ignore
  }
}
