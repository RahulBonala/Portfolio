const sharp = require('sharp');

async function convert() {
  try {
    await sharp('src/assets/waggle-app.png').webp({ quality: 80 }).toFile('src/assets/waggle-app.webp');
    await sharp('src/assets/bar-app.png').webp({ quality: 80 }).toFile('src/assets/bar-app.webp');
    await sharp('src/assets/dosth.png').webp({ quality: 80 }).toFile('src/assets/dosth.webp');
    await sharp('src/assets/iupgrade-logo.png').webp({ quality: 85 }).toFile('src/assets/iupgrade-logo.webp');
    await sharp('src/assets/byoc-logo.png').webp({ quality: 85 }).toFile('src/assets/byoc-logo.webp');
    await sharp('src/assets/bestanswer-logo.png').webp({ quality: 85 }).toFile('src/assets/bestanswer-logo.webp');
    console.log("Done");
  } catch (e) {
    console.error(e);
  }
}
convert();
