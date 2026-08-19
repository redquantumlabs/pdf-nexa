const sharp = require('sharp');

const imgPath = 'c:/pdf-nexa/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png';

async function getColor() {
  const { data } = await sharp(imgPath).extract({ left: 1, top: 1, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  console.log(`RGB: ${data[0]}, ${data[1]}, ${data[2]}`);
}

getColor();
