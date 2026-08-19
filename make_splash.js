const sharp = require('sharp');

const imgPath = 'C:/Users/Mukund/.gemini/antigravity-ide/brain/0ea2a223-1d47-4129-aac7-100af386dace/pdf_nexa_full_text_icon_1787111030597.jpg';
const outPath = 'C:/Users/Mukund/.gemini/antigravity-ide/brain/0ea2a223-1d47-4129-aac7-100af386dace/splash_logo.png';

async function makeTransparent() {
  const metadata = await sharp(imgPath).metadata();
  const cropSize = 680;
  const cropOffset = Math.floor((metadata.width - cropSize) / 2);

  const croppedBuffer = await sharp(imgPath)
    .extract({ width: cropSize, height: cropSize, left: cropOffset, top: cropOffset })
    .toBuffer();

  const image = sharp(croppedBuffer);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  
  // Make pixels close to (39, 43, 52) transparent
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // Check if pixel is within tolerance of background color
    if (Math.abs(r - 39) < 15 && Math.abs(g - 43) < 15 && Math.abs(b - 52) < 15) {
      if (info.channels === 4) {
        data[i+3] = 0; // Alpha to 0
      } else {
        // If 3 channels, we need to convert to 4 channels first
      }
    }
  }

  // To properly handle alpha, we need to ensure it's RGBA
  const imageWithAlpha = sharp(croppedBuffer).ensureAlpha();
  const { data: dataA, info: infoA } = await imageWithAlpha.raw().toBuffer({ resolveWithObject: true });
  
  for (let i = 0; i < dataA.length; i += infoA.channels) {
    const r = dataA[i];
    const g = dataA[i+1];
    const b = dataA[i+2];
    
    if (Math.abs(r - 39) < 20 && Math.abs(g - 43) < 20 && Math.abs(b - 52) < 20) {
      dataA[i+3] = 0; 
    }
  }

  await sharp(dataA, { raw: { width: infoA.width, height: infoA.height, channels: infoA.channels } })
    .png()
    .toFile(outPath);
    
  console.log('Saved splash_logo.png');
}

makeTransparent().catch(console.error);
