const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TOTAL_DURATION = 150; // seconds
const FPS = 24;
const TOTAL_FRAMES = TOTAL_DURATION * FPS; // 3600
const FRAME_DIR = '/home/z/my-project/download/frames_v4';
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

  // Verify the updateTime function exists
  const hasUpdateTime = await page.evaluate(() => typeof window.updateTime === 'function');
  console.log(`updateTime available: ${hasUpdateTime}`);

  const totalDuration = await page.evaluate(() => window.TOTAL_DURATION);
  console.log(`HTML TOTAL_DURATION: ${totalDuration}`);

  // Take a test screenshot at t=0
  await page.evaluate((t) => window.updateTime(t), 0);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(FRAME_DIR, 'test_t0.jpg'), type: 'jpeg', quality: 90 });
  console.log('Test screenshot at t=0 taken');

  // Take test at t=75 (midpoint)
  await page.evaluate((t) => window.updateTime(t), 75);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(FRAME_DIR, 'test_t75.jpg'), type: 'jpeg', quality: 90 });
  console.log('Test screenshot at t=75 taken');

  // Take test at t=149 (near end)
  await page.evaluate((t) => window.updateTime(t), 149);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(FRAME_DIR, 'test_t149.jpg'), type: 'jpeg', quality: 90 });
  console.log('Test screenshot at t=149 taken');

  console.log('Starting frame capture...');

  let lastSceneId = null;
  
  // Capture frames
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const time = frame / FPS;

    // Update the animation time manually
    await page.evaluate((t) => {
      window.updateTime(t);
    }, time);

    // Wait for CSS transitions to render
    // Give a bit more time at scene boundaries
    const currentScene = await page.evaluate((t) => {
      for (const [id, start, end] of window.sceneSchedule) {
        if (t >= start && t < end) return id;
      }
      return null;
    }, time);
    
    if (currentScene !== lastSceneId) {
      // Scene transition - give more time for transitions
      await page.waitForTimeout(50);
      lastSceneId = currentScene;
    } else {
      await page.waitForTimeout(8);
    }

    // Capture frame
    const frameNum = String(frame).padStart(5, '0');
    const framePath = path.join(FRAME_DIR, `frame_${frameNum}.jpg`);
    await page.screenshot({
      path: framePath,
      type: 'jpeg',
      quality: 92,
    });

    // Progress log every 200 frames
    if (frame % 200 === 0) {
      const pct = ((frame / TOTAL_FRAMES) * 100).toFixed(1);
      console.log(`Frame ${frame}/${TOTAL_FRAMES} (${pct}%) - t=${time.toFixed(1)}s - scene=${currentScene}`);
    }
  }

  console.log('Frame capture complete!');
  await browser.close();

  // Count frames
  const frameFiles = fs.readdirSync(FRAME_DIR).filter(f => f.endsWith('.jpg') && f.startsWith('frame_'));
  console.log(`Total frames captured: ${frameFiles.length}`);
}

recordFrames().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
