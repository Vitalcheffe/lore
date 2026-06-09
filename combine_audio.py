import numpy as np
import struct
import wave
import os

# Audio settings
SAMPLE_RATE = 44100
TOTAL_DURATION = 290  # seconds

# Sound effect cue points (from the HTML animation)
sfx_cues = [
    (0, 'rise'),       # Hook start
    (13, 'whoosh'),    # "keywords."
    (23, 'ding'),      # "understand?"
    (30, 'whoosh'),    # ClearPath AI intro
    (41, 'click'),     # NLI section
    (54, 'pop'),       # Pills appear
    (67, 'whoosh'),    # Pipeline
    (85, 'rise'),      # 407M counter
    (92, 'click'),     # Label Design
    (114, 'ding'),     # Just right
    (120, 'whoosh'),   # Multi-Need
    (139, 'click'),    # Honest Confidence
    (164, 'rise'),     # Crisis Detection
    (182, 'whoosh'),   # Crisis banner
    (195, 'whoosh'),   # Demo
    (219, 'pop'),      # Results appear
    (240, 'ding'),     # Impact start
    (264, 'rise'),     # ClearPath AI big
    (288, 'ding'),     # Thank you
]

def read_wav(filepath):
    """Read a WAV file and return float32 samples"""
    with wave.open(filepath, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
    
    if sampwidth == 2:
        samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    elif sampwidth == 4:
        samples = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise ValueError(f"Unsupported sample width: {sampwidth}")
    
    # Convert stereo to mono
    if n_channels == 2:
        samples = samples.reshape(-1, 2).mean(axis=1)
    
    # Resample if needed
    if framerate != SAMPLE_RATE:
        ratio = SAMPLE_RATE / framerate
        new_len = int(len(samples) * ratio)
        indices = np.linspace(0, len(samples) - 1, new_len).astype(int)
        samples = samples[indices]
    
    return samples

def write_wav(filepath, samples, sample_rate=SAMPLE_RATE):
    """Write float32 samples to WAV file"""
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    
    with wave.open(filepath, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int_samples.tobytes())

# Load background music
print("Loading background music...")
bg_music = read_wav('/home/z/my-project/download/bg_music.wav')
print(f"  BG music: {len(bg_music)} samples ({len(bg_music)/SAMPLE_RATE:.1f}s)")

# Create combined audio track
total_samples = TOTAL_DURATION * SAMPLE_RATE
combined = np.zeros(total_samples, dtype=np.float32)

# Add background music (trim to video length)
bg_len = min(len(bg_music), total_samples)
combined[:bg_len] += bg_music[:bg_len]
print(f"  Added background music")

# Add sound effects at cue points
sfx_dir = '/home/z/my-project/download'
sfx_files = {
    'whoosh': 'sfx_whoosh.wav',
    'pop': 'sfx_pop.wav',
    'ding': 'sfx_ding.wav',
    'click': 'sfx_click.wav',
    'rise': 'sfx_rise.wav',
}

# Pre-load all SFX
sfx_data = {}
for name, filename in sfx_files.items():
    filepath = os.path.join(sfx_dir, filename)
    sfx_data[name] = read_wav(filepath)
    print(f"  Loaded SFX: {name} ({len(sfx_data[name])/SAMPLE_RATE:.2f}s)")

# Overlay SFX at cue points
for time_sec, sfx_type in sfx_cues:
    if sfx_type not in sfx_data:
        print(f"  WARNING: Unknown SFX type: {sfx_type}")
        continue
    
    sfx = sfx_data[sfx_type]
    start_sample = int(time_sec * SAMPLE_RATE)
    end_sample = start_sample + len(sfx)
    
    if end_sample > total_samples:
        sfx = sfx[:total_samples - start_sample]
        end_sample = total_samples
    
    # Apply volume adjustment - SFX should be audible but not overwhelming
    sfx_volume = 0.4  # SFX volume relative to music
    combined[start_sample:end_sample] += sfx * sfx_volume
    print(f"  Added {sfx_type} at {time_sec}s")

# Normalize to prevent clipping
max_val = np.max(np.abs(combined))
if max_val > 0.95:
    combined = combined * 0.9 / max_val

# Write combined audio
output_path = '/home/z/my-project/download/combined_audio.wav'
write_wav(output_path, combined)
print(f"\nCombined audio written to {output_path}")
print(f"File size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB")
print(f"Duration: {len(combined)/SAMPLE_RATE:.1f}s")
