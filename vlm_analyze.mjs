import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ZAI = require('/home/z/.bun/install/global/node_modules/z-ai-web-dev-sdk/dist/index.js').default;
import fs from 'fs';
import path from 'path';

async function analyzeImage(imagePath, prompt) {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = 'image/png';

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Image}` }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}

const prompt = "Describe the visual design of this PDF page in exhaustive detail - colors (approximate hex codes), layout, typography, spacing, margins, decorative elements, header/footer design, color scheme, font styles, gradients, patterns, professional quality assessment. Be very specific.";

const images = [
  '/home/z/my-project/download/mit_page1.png',
  '/home/z/my-project/download/mit_page2.png',
  '/home/z/my-project/download/mit_page4.png',
  '/home/z/my-project/download/harch_page1.png',
  '/home/z/my-project/download/harch_page2.png',
  '/home/z/my-project/download/harch_page4.png',
];

for (const img of images) {
  const name = path.basename(img);
  console.log(`\n===== ${name} =====`);
  try {
    const result = await analyzeImage(img, prompt);
    console.log(result);
  } catch (e) {
    console.error(`Error analyzing ${name}: ${e.message}`);
    console.log('Waiting 30s before retry...');
    await new Promise(r => setTimeout(r, 30000));
    try {
      const result = await analyzeImage(img, prompt);
      console.log(result);
    } catch (e2) {
      console.error(`Retry failed for ${name}: ${e2.message}`);
    }
  }
  console.log('Waiting 10s before next image...');
  await new Promise(r => setTimeout(r, 10000));
}
