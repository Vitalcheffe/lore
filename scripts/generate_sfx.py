#!/usr/bin/env python3
"""
Generate sound effects for Apple Keynote-style pitch video.
All effects: 44100 Hz, 16-bit PCM WAV, mono.
"""

import numpy as np
import wave
import os

SAMPLE_RATE = 44100

def write_wav(filename, audio_data, sample_rate=SAMPLE_RATE):
    """Write audio data to 16-bit PCM WAV file."""
    audio_data = np.clip(audio_data, -1.0, 1.0)
    audio_16bit = (audio_data * 32767).astype(np.int16)
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_16bit.tobytes())
    size = os.path.getsize(filename)
    print(f"  Written: {filename} ({size:,} bytes)")

# ── 1. Whoosh (transition sound) ──────────────────────────────────────────
def generate_whoosh():
    """0.4s filtered white noise with bandpass sweep (high to low)."""
    duration = 0.4
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # White noise
    noise = np.random.randn(n_samples)
    
    # Bandpass sweep: simulate by multiplying noise with sweeping sine
    # High frequency start, low frequency end
    sweep_high = 3000.0
    sweep_low = 300.0
    sweep_freq = sweep_high + (sweep_low - sweep_high) * t / duration
    
    # Simple bandpass approximation: modulate noise with the sweep
    # Use multiple filtered components
    result = np.zeros(n_samples)
    for i in range(n_samples):
        # Create a short window of noise, filter around current sweep freq
        window_size = int(SAMPLE_RATE * 0.005)  # 5ms window
        half_win = window_size // 2
        start = max(0, i - half_win)
        end = min(n_samples, i + half_win)
        
        # Simple resonant filter simulation: multiply by sin at sweep freq
        freq = sweep_freq[i]
        result[i] = noise[i] * (0.5 + 0.5 * np.sin(2 * np.pi * freq * t[i]))
    
    # Amplitude envelope: quick fade in, quick fade out
    attack = int(n_samples * 0.15)
    release = int(n_samples * 0.4)
    envelope = np.ones(n_samples)
    envelope[:attack] = np.linspace(0, 1, attack)
    envelope[-release:] = np.linspace(1, 0, release)
    
    result *= envelope
    
    # Normalize to target amplitude
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak * 0.3
    
    return result

# ── 2. Pop (text appear sound) ────────────────────────────────────────────
def generate_pop():
    """0.15s short sine wave burst at 800Hz with exponential decay."""
    duration = 0.15
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Sine wave at 800Hz
    tone = np.sin(2 * np.pi * 800 * t)
    
    # Quick attack, exponential decay
    attack = int(n_samples * 0.02)  # Very quick attack
    envelope = np.exp(-t * 30)  # Fast exponential decay
    envelope[:attack] = np.linspace(0, 1, attack)
    
    result = tone * envelope
    
    # Normalize
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak * 0.25
    
    return result

# ── 3. Ding (highlight/important sound) ───────────────────────────────────
def generate_ding():
    """0.5s sine wave at 1200Hz + 1800Hz (harmonics), slow decay."""
    duration = 0.5
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Fundamental + harmonics
    fundamental = np.sin(2 * np.pi * 1200 * t) * 0.7
    harmonic1 = np.sin(2 * np.pi * 1800 * t) * 0.25  # 3rd harmonic
    harmonic2 = np.sin(2 * np.pi * 2400 * t) * 0.05  # 5th harmonic
    
    tone = fundamental + harmonic1 + harmonic2
    
    # Slow decay envelope
    attack = int(n_samples * 0.01)
    envelope = np.exp(-t * 6)  # Slower decay
    envelope[:attack] = np.linspace(0, 1, attack)
    
    result = tone * envelope
    
    # Normalize
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak * 0.2
    
    return result

# ── 4. Click (subtle click) ──────────────────────────────────────────────
def generate_click():
    """0.05s very short noise burst."""
    duration = 0.05
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Short noise burst
    noise = np.random.randn(n_samples)
    
    # Very fast exponential decay
    envelope = np.exp(-t * 200)
    
    # Add tiny tonal component for "click" character
    tonal = np.sin(2 * np.pi * 500 * t) * np.exp(-t * 300) * 0.3
    
    result = (noise * envelope * 0.7 + tonal * 0.3)
    
    # Normalize
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak * 0.2
    
    return result

# ── 5. Rise (building tension/reveal) ─────────────────────────────────────
def generate_rise():
    """1.0s sine wave sweeping from 300Hz to 1200Hz, volume crescendo."""
    duration = 1.0
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Frequency sweep from 300Hz to 1200Hz (exponential for musical feel)
    freq_start = 300.0
    freq_end = 1200.0
    freq = freq_start * (freq_end / freq_start) ** (t / duration)
    
    # Phase accumulation for smooth sweep
    phase = np.cumsum(2 * np.pi * freq / SAMPLE_RATE)
    tone = np.sin(phase)
    
    # Add subtle harmonics for richness
    tone += np.sin(phase * 2) * 0.2  # Octave above
    tone += np.sin(phase * 0.5) * 0.1  # Octave below
    
    # Volume crescendo
    envelope = np.linspace(0, 1, n_samples) ** 2  # Quadratic crescendo
    
    result = tone * envelope
    
    # Normalize
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak * 0.25
    
    return result

# ── Main ───────────────────────────────────────────────────────────────────

def main():
    print("Generating sound effects...")
    
    output_dir = '/home/z/my-project/download'
    
    # 1. Whoosh
    print("\n  [1/5] Generating Whoosh (transition)...")
    whoosh = generate_whoosh()
    write_wav(os.path.join(output_dir, 'sfx_whoosh.wav'), whoosh)
    
    # 2. Pop
    print("  [2/5] Generating Pop (text appear)...")
    pop = generate_pop()
    write_wav(os.path.join(output_dir, 'sfx_pop.wav'), pop)
    
    # 3. Ding
    print("  [3/5] Generating Ding (highlight)...")
    ding = generate_ding()
    write_wav(os.path.join(output_dir, 'sfx_ding.wav'), ding)
    
    # 4. Click
    print("  [4/5] Generating Click (subtle)...")
    click = generate_click()
    write_wav(os.path.join(output_dir, 'sfx_click.wav'), click)
    
    # 5. Rise
    print("  [5/5] Generating Rise (tension/reveal)...")
    rise = generate_rise()
    write_wav(os.path.join(output_dir, 'sfx_rise.wav'), rise)
    
    print("\n  All sound effects generated successfully!")

if __name__ == '__main__':
    main()
