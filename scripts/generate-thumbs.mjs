import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const INPUT_DIR = path.join(process.cwd(), "public", "images");
const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "thumbs");

const THUMB_WIDTH = 800;
const JPEG_QUALITY = 72;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs
    .readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(name => /\.(jpe?g|png)$/i.test(name));

let generated = 0;

for (const file of files) {
    const inPath = path.join(INPUT_DIR, file);

    const base = file.replace(/\.(jpe?g|png)$/i, "");
    const outPath = path.join(OUTPUT_DIR, `${base}.jpg`);

    // Skip if thumb already exists
    if (fs.existsSync(outPath)) continue;

    await sharp(inPath)
        .rotate() // respect EXIF orientation
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
        .toFile(outPath);

    generated++;
}

console.log(`Generated ${generated} thumbnails in: ${OUTPUT_DIR}`);