import { chromium } from 'playwright';

const TOTAL_DURATION = 108000; // 108 seconds

async function main() {
  console.log('Launching browser with video recording...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: '/home/z/my-project/download/video-espoir',
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  console.log('Loading animation...');
  await page.goto('file:///home/z/my-project/download/couleur-espoir.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Recording animation (' + (TOTAL_DURATION/1000) + 's)...');
  await page.waitForTimeout(TOTAL_DURATION);

  console.log('Closing browser (saves video)...');
  await context.close();
  await browser.close();

  console.log('Done! Video saved to /home/z/my-project/download/video-espoir/');
}

main().catch(console.error);
