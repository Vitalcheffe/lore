/**
 * HTML Animation → MP4 Video Recorder
 * Uses Playwright to record the auto-playing animation, then ffmpeg to convert to MP4.
 * 
 * Usage: node record-video.mjs <html-file> <output-mp4> [duration-seconds]
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { existsSync, unlinkSync, renameSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const htmlFile = process.argv[2];
const outputMp4 = process.argv[3] || '/home/z/my-project/download/output.mp4';
const durationSeconds = parseInt(process.argv[4]) || 280;

if (!htmlFile || !existsSync(htmlFile)) {
  console.error('Usage: node record-video.mjs <html-file> [output-mp4] [duration-seconds]');
  process.exit(1);
}

const htmlPath = resolve(htmlFile);
const fileUrl = `file://${htmlPath}`;

// Playwright records as webm, we'll convert to mp4
const tempWebm = outputMp4.replace('.mp4', '_temp.webm');

async function recordVideo() {
  console.log(`🎬 Recording ${htmlFile} for ${durationSeconds}s...`);
  console.log(`   URL: ${fileUrl}`);
  console.log(`   Output: ${outputMp4}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: '/tmp/playwright-video',
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  // Navigate to the HTML file
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  console.log('   Page loaded. Starting recording...');

  // Wait for the animation to play
  // We'll wait the specified duration
  await page.waitForTimeout(durationSeconds * 1000);

  // Close to finalize the video
  const videoPath = await page.video().path();
  console.log(`   Recording saved to: ${videoPath}`);

  await context.close();
  await browser.close();

  // Convert webm to mp4 using ffmpeg
  console.log('🔄 Converting WebM → MP4 with ffmpeg...');
  
  try {
    // Check if the webm file exists at the reported path
    let sourceFile = videoPath;
    if (!existsSync(sourceFile)) {
      // Playwright might save it in /tmp with a different name
      console.log('   Checking alternative paths...');
      const { readdirSync } = await import('fs');
      const tmpFiles = readdirSync('/tmp/playwright-video/');
      console.log('   Files in video dir:', tmpFiles);
      if (tmpFiles.length > 0) {
        sourceFile = `/tmp/playwright-video/${tmpFiles[tmpFiles.length - 1]}`;
      }
    }

    if (!existsSync(sourceFile)) {
      throw new Error(`Source video not found at ${sourceFile}`);
    }

    // FFmpeg conversion: webm → mp4 with high quality
    execSync(
      `ffmpeg -y -i "${sourceFile}" ` +
      `-c:v libx264 -preset slow -crf 18 ` +
      `-pix_fmt yuv420p -movflags +faststart ` +
      `-r 60 ` +
      `"${outputMp4}"`,
      { stdio: 'inherit' }
    );

    console.log(`✅ MP4 saved to: ${outputMp4}`);

    // Get file size
    const stats = execSync(`du -h "${outputMp4}"`).toString().trim();
    console.log(`   File size: ${stats}`);

    // Get duration
    try {
      const probe = execSync(
        `ffprobe -v error -show_entries format=duration -of csv=p=0 "${outputMp4}"`
      ).toString().trim();
      console.log(`   Duration: ${parseFloat(probe).toFixed(1)}s`);
    } catch (e) {
      // Ignore probe errors
    }

    // Cleanup temp file
    try { unlinkSync(sourceFile); } catch (e) {}

  } catch (err) {
    console.error('❌ FFmpeg conversion failed:', err.message);
    
    // Try to copy the webm as fallback
    try {
      const fallbackOutput = outputMp4.replace('.mp4', '.webm');
      execSync(`cp "${videoPath}" "${fallbackOutput}"`);
      console.log(`⚠️  Saved as WebM fallback: ${fallbackOutput}`);
      console.log('   You can convert manually with:');
      console.log(`   ffmpeg -i "${fallbackOutput}" -c:v libx264 -crf 18 -pix_fmt yuv420p "${outputMp4}"`);
    } catch (e2) {
      console.error('Could not save fallback either:', e2.message);
    }
  }
}

recordVideo().catch(err => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});
