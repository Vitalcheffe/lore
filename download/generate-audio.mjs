import { execSync } from 'child_process';

// Use FFmpeg to generate ambient audio
// Layer 1: Deep drone (pad)
// Layer 2: Subtle chime accents
// Layer 3: Soft heartbeat pulse

const DURATION = 112;

// Generate layered ambient audio with FFmpeg
const cmd = `ffmpeg -y \
  -f lavfi -i "sine=frequency=55:duration=${DURATION}" \
  -f lavfi -i "sine=frequency=82:duration=${DURATION}" \
  -f lavfi -i "sine=frequency=110:duration=${DURATION}" \
  -f lavfi -i "sine=frequency=165:duration=${DURATION}" \
  -filter_complex "\
    [0:a]volume=0.15[a0]; \
    [1:a]volume=0.10[a1]; \
    [2:a]volume=0.08[a2]; \
    [3:a]volume=0.05[a3]; \
    [a0][a1][a2][a3]amix=inputs=4:duration=longest, \
    afade=t=in:st=0:d=4, \
    afade=t=out:st=105:d=7, \
    lowpass=f=800, \
    volume=0.6 \
  " \
  -c:a aac -b:a 192k \
  /home/z/my-project/download/espoir-audio.m4a`;

console.log('Generating ambient audio...');
execSync(cmd, { stdio: 'inherit' });
console.log('Audio generated!');
