#!/usr/bin/env python3
"""
Generate ~5 minute ambient background music track in Apple Keynote style.
Soft, minimal, modern, corporate feel.
"""

import numpy as np
import struct
import wave
import os

# ── Configuration ──────────────────────────────────────────────────────────
SAMPLE_RATE = 44100
DURATION = 300  # 5 minutes
NUM_SAMPLES = SAMPLE_RATE * DURATION
MAX_AMPLITUDE = 0.15  # Quiet background music

# Chord frequencies (C major → A minor → F major → G major)
CHORDS = {
    'C':  [261.63, 329.63, 392.00],   # C4, E4, G4
    'Am': [220.00, 261.63, 329.63],   # A3, C4, E4
    'F':  [349.23, 440.00, 523.25],   # F4, A4, C5
    'G':  [392.00, 493.88, 587.33],   # G4, B4, D5
}

CHORD_SEQUENCE = ['C', 'Am', 'F', 'G']
CHORD_DURATION = 8.0  # seconds per chord

# ── Helper functions ───────────────────────────────────────────────────────

def generate_pad(freq, duration, sample_rate=SAMPLE_RATE):
    """Generate a soft pad sound using detuned sine waves with slow amplitude modulation."""
    n_samples = int(sample_rate * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Main tone + slight detuning for warmth (chorus effect)
    detune1 = freq * 1.003  # +3 cents
    detune2 = freq * 0.997  # -3 cents
    
    tone_main = np.sin(2 * np.pi * freq * t)
    tone_det1 = np.sin(2 * np.pi * detune1 * t)
    tone_det2 = np.sin(2 * np.pi * detune2 * t)
    
    # Slow amplitude modulation (tremolo) - very gentle
    lfo_rate = 0.2 + np.random.random() * 0.3  # 0.2-0.5 Hz, slow
    mod = 0.7 + 0.3 * np.sin(2 * np.pi * lfo_rate * t)
    
    # Blend the detuned tones
    pad = (tone_main * 0.5 + tone_det1 * 0.25 + tone_det2 * 0.25) * mod
    
    return pad

def generate_chord_pad(chord_name, duration, sample_rate=SAMPLE_RATE):
    """Generate a full chord pad from chord name."""
    freqs = CHORDS[chord_name]
    
    result = np.zeros(int(sample_rate * duration))
    for freq in freqs:
        # Add a subtle octave below for warmth
        result += generate_pad(freq, duration, sample_rate) * 0.4
        result += generate_pad(freq / 2, duration, sample_rate) * 0.15  # sub-octave
    
    # Normalize the chord to prevent clipping
    peak = np.max(np.abs(result))
    if peak > 0:
        result = result / peak
    
    return result

def generate_soft_click(sample_rate=SAMPLE_RATE):
    """Generate a very soft filtered click."""
    click_duration = 0.02  # 20ms
    num_click_samples = int(sample_rate * click_duration)
    t = np.linspace(0, click_duration, num_click_samples, endpoint=False)
    
    # Short burst of filtered noise
    noise = np.random.randn(num_click_samples) * 0.5
    
    # Simple lowpass via exponential decay (simulates filtered click)
    envelope = np.exp(-t * 300)
    
    # Add a subtle tonal component
    click = noise * envelope + np.sin(2 * np.pi * 150 * t) * envelope * 0.3
    
    return click * 0.08  # Very quiet

def write_wav(filename, audio_data, sample_rate=SAMPLE_RATE):
    """Write audio data to 16-bit PCM WAV file."""
    # Clip to [-1, 1]
    audio_data = np.clip(audio_data, -1.0, 1.0)
    
    # Convert to 16-bit integers
    audio_16bit = (audio_data * 32767).astype(np.int16)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_16bit.tobytes())
    
    print(f"  Written: {filename}")

# ── Main generation ────────────────────────────────────────────────────────

def main():
    print("Generating 5-minute ambient background music...")
    print(f"  Sample rate: {SAMPLE_RATE} Hz")
    print(f"  Duration: {DURATION} seconds")
    print(f"  Max amplitude: {MAX_AMPLITUDE}")
    
    # Generate full audio buffer
    audio = np.zeros(NUM_SAMPLES)
    
    # ── 1. Generate chord pad progression ──────────────────────────────
    print("  Generating chord pads...")
    crossfade_duration = 1.0  # 1 second crossfade between chords
    crossfade_samples = int(SAMPLE_RATE * crossfade_duration)
    
    # How many full chord cycles fit in the duration?
    full_cycle_duration = len(CHORD_SEQUENCE) * CHORD_DURATION  # 32 seconds
    num_cycles = int(np.ceil(DURATION / full_cycle_duration))
    
    # Pre-generate all chord segments
    all_pads = []
    total_pad_time = 0
    
    for cycle in range(num_cycles):
        for chord_name in CHORD_SEQUENCE:
            pad = generate_chord_pad(chord_name, CHORD_DURATION)
            all_pads.append(pad)
            total_pad_time += CHORD_DURATION
    
    # Stitch pads together with crossfades
    print("  Stitching chord progression with crossfades...")
    total_samples = int(total_pad_time * SAMPLE_RATE)
    pad_audio = np.zeros(total_samples)
    
    offset = 0
    for i, pad in enumerate(all_pads):
        pad_len = len(pad)
        end = min(offset + pad_len, len(pad_audio))
        actual_len = end - offset
        
        if i > 0 and actual_len >= crossfade_samples and offset >= crossfade_samples:
            # Crossfade with previous segment
            fade_in = np.linspace(0, 1, crossfade_samples)
            fade_out = np.linspace(1, 0, crossfade_samples)
            
            # Blend the overlap region
            overlap_start = offset - crossfade_samples
            prev_chunk = pad_audio[overlap_start:offset]
            new_chunk = pad[:crossfade_samples]
            
            pad_audio[overlap_start:offset] = prev_chunk * fade_out + new_chunk * fade_in
            
            # Add the rest of the new pad
            remaining = pad[crossfade_samples:actual_len]
            if len(remaining) > 0:
                pad_audio[offset:end - crossfade_samples] = remaining
        else:
            pad_audio[offset:end] = pad[:actual_len]
        
        offset += pad_len
    
    # Trim or loop to fit exact duration
    if len(pad_audio) >= NUM_SAMPLES:
        pad_audio = pad_audio[:NUM_SAMPLES]
    else:
        # Loop to fill
        repeats = int(np.ceil(NUM_SAMPLES / len(pad_audio)))
        pad_audio = np.tile(pad_audio, repeats)[:NUM_SAMPLES]
    
    audio += pad_audio * 0.6  # Pad level
    
    # ── 2. Add subtle high-frequency shimmer ───────────────────────────
    print("  Adding subtle shimmer...")
    t = np.linspace(0, DURATION, NUM_SAMPLES, endpoint=False)
    
    # Very soft high shimmer (like a soft bell/glockenspiel hint)
    shimmer_freq = 880.0
    shimmer = np.sin(2 * np.pi * shimmer_freq * t) * 0.02
    # Slow random-ish modulation
    shimmer_mod = 0.3 + 0.7 * np.sin(2 * np.pi * 0.05 * t) * np.sin(2 * np.pi * 0.07 * t + 1.3)
    shimmer *= shimmer_mod
    
    audio += shimmer
    
    # ── 3. Add gentle pulse/click at ~70 BPM ───────────────────────────
    print("  Adding gentle pulse at ~70 BPM...")
    bpm = 70
    beat_interval = 60.0 / bpm  # ~0.857 seconds
    beat_times = np.arange(0, DURATION, beat_interval)
    
    click_template = generate_soft_click()
    for beat_time in beat_times:
        sample_pos = int(beat_time * SAMPLE_RATE)
        end_pos = sample_pos + len(click_template)
        if end_pos <= NUM_SAMPLES:
            audio[sample_pos:end_pos] += click_template * 0.5  # Very subtle
    
    # ── 4. Apply master volume envelope ─────────────────────────────────
    print("  Applying fade in/out envelope...")
    envelope = np.ones(NUM_SAMPLES)
    
    # Fade in over first 10 seconds
    fade_in_samples = int(10.0 * SAMPLE_RATE)
    envelope[:fade_in_samples] = np.linspace(0, 1, fade_in_samples)
    
    # Fade out over last 10 seconds
    fade_out_samples = int(10.0 * SAMPLE_RATE)
    envelope[-fade_out_samples:] = np.linspace(1, 0, fade_out_samples)
    
    audio *= envelope
    
    # ── 5. Apply master amplitude ──────────────────────────────────────
    peak = np.max(np.abs(audio))
    if peak > 0:
        audio = audio / peak * MAX_AMPLITUDE
    
    # ── 6. Write WAV file ──────────────────────────────────────────────
    output_path = '/home/z/my-project/download/bg_music.wav'
    write_wav(output_path, audio)
    print(f"  Background music saved to: {output_path}")
    
    # Verify
    file_size = os.path.getsize(output_path)
    print(f"  File size: {file_size:,} bytes ({file_size / 1024 / 1024:.1f} MB)")

if __name__ == '__main__':
    main()
