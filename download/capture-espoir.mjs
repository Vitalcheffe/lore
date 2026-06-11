import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';

const TOTAL_DURATION = 105000; // 105 seconds
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const FRAME_DIR = '/home/z/my-project/download/frames-espoir';
const OUTPUT = '/home/z/my-project/download/couleur-espoir-raw.webm';

// Clean frame dir
if (fs.existsSync(FRAME_DIR)) {
  fs.rmSync(FRAME_DIR, { recursive: true });
}
fs.mkdirSync(FRAME_DIR, { recursive: true });

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('Loading animation...');
  await page.goto('file:///home/z/my-project/download/couleur-espoir.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Starting frame capture...');
  const startTime = Date.now();
  let frameCount = 0;

  while (Date.now() - startTime < TOTAL_DURATION) {
    const elapsed = Date.now() - startTime;
    const frameNum = Math.floor(elapsed / (1000 / FPS));
    
    if (frameNum > frameCount) {
      const padded = String(frameNum).padStart(6, '0');
      await page.screenshot({ 
        path: `${FRAME_DIR}/frame_${padded}.png`,
        type: 'png'
      });
      frameCount = frameNum;
    }
    
    // Small delay to not overload
    await page.waitForTimeout(1000 / FPS);
  }

  console.log(`Captured ${frameCount} frames`);
  await browser.close();

  // Encode to video using FFmpeg
  console.log('Encoding video with FFmpeg...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i ${FRAME_DIR}/frame_%06d.png ` +
    `-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p ` +
    `-movflags +faststart ${OUTPUT}`,
    { stdio: 'inherit' }
  );

  console.log('Raw video created:', OUTPUT);

  // Cleanup frames
  fs.rmSync(FRAME_DIR, { recursive: true });
  console.log('Frame cleanup done.');
}

main().catch(console.error);
