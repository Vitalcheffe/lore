const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TOTAL_DURATION = 290; // seconds
const FPS = 8;
const TOTAL_FRAMES = TOTAL_DURATION * FPS;
const FRAME_DIR = '/home/z/my-project/download/frames';
const HTML_PATH = '/home/z/my-project/download/pitch_v3.html';

async function recordFrames() {
  // Clean up frame directory
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

  // Load the animation HTML
  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Stop the auto-play and take manual control
  await page.evaluate(() => {
    // The autoPlay function runs via requestAnimationFrame, but we'll override time manually
    window._manualMode = true;
  });

  console.log('Starting frame capture...');

  // Capture frames
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const time = frame / FPS;

    // Update the animation time manually
    await page.evaluate((t) => {
      window.updateTime(t);
    }, time);

    // Small delay to let CSS transitions render
    await page.waitForTimeout(15);

    // Capture frame
    const frameNum = String(frame).padStart(5, '0');
    const framePath = path.join(FRAME_DIR, `frame_${frameNum}.jpg`);
    await page.screenshot({
      path: framePath,
      type: 'jpeg',
      quality: 92,
    });

    // Progress log every 100 frames
    if (frame % 100 === 0) {
      const pct = ((frame / TOTAL_FRAMES) * 100).toFixed(1);
      console.log(`Frame ${frame}/${TOTAL_FRAMES} (${pct}%) - t=${time.toFixed(1)}s`);
    }
  }

  console.log('Frame capture complete!');
  await browser.close();

  // Count frames
  const frameFiles = fs.readdirSync(FRAME_DIR).filter(f => f.endsWith('.jpg'));
  console.log(`Total frames captured: ${frameFiles.length}`);
}

recordFrames().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
