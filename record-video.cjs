const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const htmlFile = process.argv[2] || '/home/z/my-project/download/lore-promo-video.html';
const outputMp4 = process.argv[3] || '/home/z/my-project/download/lore-promo-video.mp4';
const durationSeconds = parseInt(process.argv[4]) || 270;

const fileUrl = `file://${path.resolve(htmlFile)}`;

(async () => {
  console.log(`Recording ${durationSeconds}s from ${htmlFile}...`);
  
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: '/tmp/pw-vid', size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  console.log('Page loaded. Recording...');
  
  // Wait for the full animation
  await page.waitForTimeout(durationSeconds * 1000);
  
  const videoPath = await page.video().path();
  console.log(`WebM saved: ${videoPath}`);
  
  await context.close();
  await browser.close();
  
  // Find the actual webm file
  let sourceFile = videoPath;
  if (!fs.existsSync(sourceFile)) {
    const files = fs.readdirSync('/tmp/pw-vid/');
    if (files.length > 0) sourceFile = `/tmp/pw-vid/${files[files.length - 1]}`;
  }
  
  if (!fs.existsSync(sourceFile)) {
    console.error('Source video not found!');
    process.exit(1);
  }
  
  console.log(`Converting ${sourceFile} → ${outputMp4}...`);
  try {
    execSync(
      `ffmpeg -y -i "${sourceFile}" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 60 -movflags +faststart "${outputMp4}"`,
      { stdio: 'inherit' }
    );
    console.log(`DONE: ${outputMp4}`);
    
    const size = execSync(`du -h "${outputMp4}"`).toString().trim();
    console.log(`Size: ${size}`);
    
    try {
      const dur = execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${outputMp4}"`).toString().trim();
      console.log(`Duration: ${parseFloat(dur).toFixed(1)}s`);
    } catch(e) {}
    
  } catch (err) {
    console.error('ffmpeg failed, saving as webm...');
    const webmOut = outputMp4.replace('.mp4', '.webm');
    fs.copyFileSync(sourceFile, webmOut);
    console.log(`Saved WebM: ${webmOut}`);
  }
  
  // Cleanup
  try { fs.unlinkSync(sourceFile); } catch(e) {}
  console.log('Complete!');
})();
