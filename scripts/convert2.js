const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const assetsDir = path.join(__dirname, 'src/assets');
  const files = [
    'waggle-app.png',
    'bar-app.png',
    'dosth.png',
    'iupgrade-logo.png',
    'byoc-logo.png',
    'bestanswer-logo.png'
  ];

  for (const f of files) {
     const input = path.join(assetsDir, f);
     const output = path.join(assetsDir, f.replace('.png', '.webp'));
     if(fs.existsSync(input)) {
         console.log("converting", input);
         await sharp(input).webp({ quality: 80 }).toFile(output);
     } else {
         console.log("missing", input);
     }
  }

  // Create apple touch icon
  try {
     const svg = fs.readFileSync(path.join(__dirname, 'public/logo.svg'));
     await sharp(svg).resize(180, 180).png().toFile(path.join(__dirname, 'public/apple-touch-icon.png'));
     console.log("Created apple-touch-icon.png");
  } catch (e) {
     console.log("SVG to PNG fail", e);
  }
}
run();
