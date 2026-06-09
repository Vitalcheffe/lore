import subprocess
import cv2
import numpy as np
import os
import glob
import sys

FRAME_DIR = '/home/z/my-project/download/frames'
OUTPUT = '/home/z/my-project/download/ClearPath_AI_Demo.mp4'
AUDIO = '/home/z/my-project/download/combined_audio.wav'

# Get sorted frame files
frames = sorted(glob.glob(os.path.join(FRAME_DIR, 'frame_*.jpg')))
print(f"Total frames: {len(frames)}")

# Read first frame to get dimensions
first_img = cv2.imread(frames[0])
height, width = first_img.shape[:2]
print(f"Frame size: {width}x{height}")

# Pipe frames directly to ffmpeg for H.264 encoding + audio
cmd = [
    'ffmpeg', '-y',
    # Input 0: raw frames from pipe
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', f'{width}x{height}',
    '-r', '8',  # 8fps input
    '-i', 'pipe:0',
    # Input 1: audio file
    '-i', AUDIO,
    # Video codec: H.264
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-r', '24',  # 24fps output
    # Audio codec: AAC
    '-c:a', 'aac',
    '-b:a', '192k',
    # Sync
    '-shortest',
    '-movflags', '+faststart',
    OUTPUT
]

print("Starting ffmpeg encoding with H.264 + AAC...")
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

# Write frames to ffmpeg stdin with proper error handling
for i, frame_path in enumerate(frames):
    img = cv2.imread(frame_path)
    if img is None:
        print(f"WARNING: Could not read {frame_path}")
        continue
    
    # Write frame 3 times (8fps -> 24fps)
    try:
        for _ in range(3):
            proc.stdin.write(img.tobytes())
    except BrokenPipeError:
        # Read stderr to see what went wrong
        stderr_output = proc.stderr.read().decode()
        print(f"Broken pipe at frame {i}. ffmpeg stderr:")
        print(stderr_output[-3000:])
        sys.exit(1)
    
    if i % 200 == 0:
        pct = i/len(frames)*100
        print(f"Sent frame {i}/{len(frames)} ({pct:.1f}%)")
        sys.stdout.flush()

print("All frames sent, waiting for ffmpeg to finish...")
try:
    proc.stdin.close()
except:
    pass

stdout, stderr = proc.communicate(timeout=300)

if proc.returncode != 0:
    print(f"ffmpeg error (code {proc.returncode}):")
    print(stderr.decode()[-3000:])
else:
    print("Encoding complete!")
    size_mb = os.path.getsize(OUTPUT) / 1024 / 1024
    print(f"Output: {OUTPUT}")
    print(f"File size: {size_mb:.1f} MB")
