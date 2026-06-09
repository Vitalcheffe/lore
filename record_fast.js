const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TOTAL_DURATION = 150;
const FPS = 15;
const TOTAL_FRAMES = TOTAL_DURATION * FPS; // 2250
const FRAME_DIR = '/home/z/my-project/download/frames_v4';
const HTML_PATH = '/home/z/my-project/download/pitch_v3.html';

async function recordFrames() {
  if (fs.existsSync(FRAME_DIR)) {
    fs.rmSync(FRAME_DIR, { recursive: true });
  }
  fs.mkdirSync(FRAME_DIR, { recursive: true });

  console.log(`Recording ${TOTAL_FRAMES} frames at ${FPS}fps (${TOTAL_DURATION}s)...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Quick test
  await page.evaluate((t) => window.updateTime(t), 0);
  await page.waitForTimeout(100);
  console.log('Ready to record');

  // Batch: capture frames in chunks to avoid overhead
  const CHUNK = 50;
  for (let startFrame = 0; startFrame < TOTAL_FRAMES; startFrame += CHUNK) {
    const endFrame = Math.min(startFrame + CHUNK, TOTAL_FRAMES);
    
    for (let frame = startFrame; frame < endFrame; frame++) {
      const time = frame / FPS;
      await page.evaluate((t) => window.updateTime(t), time);
      
      const frameNum = String(frame).padStart(5, '0');
      await page.screenshot({
        path: path.join(FRAME_DIR, `frame_${frameNum}.jpg`),
        type: 'jpeg',
        quality: 90,
      });
    }
    
    // Progress
    const pct = ((endFrame / TOTAL_FRAMES) * 100).toFixed(1);
    const t = endFrame / FPS;
    console.log(`Frame ${endFrame}/${TOTAL_FRAMES} (${pct}%) - t=${t.toFixed(1)}s`);
  }

  console.log('Frame capture complete!');
  await browser.close();

  const count = fs.readdirSync(FRAME_DIR).filter(f => f.startsWith('frame_')).length;
  console.log(`Total frames: ${count}`);
}

recordFrames().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
