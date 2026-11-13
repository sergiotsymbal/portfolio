// Generates web-ready images in public/images from the originals in assets/images.
// Run: npm run images
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets/images";
const OUT = "public/images";

/**
 * Each job: source file, output base name, display size in CSS px (the frame it's shown in),
 * and an optional crop (fractions of the source) to match the frame's aspect ratio.
 */
const jobs = [
  {
    src: "book.jpg",
    name: "book-cover",
    // Frame on the page is 288×420 (w-72 h-[420px]); the book sits centred in a square canvas.
    display: { width: 288, height: 420 },
  },
];

const kb = async (f) => `${((await stat(f)).size / 1024).toFixed(0)} KB`;

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const input = path.join(SRC, job.src);
  const meta = await sharp(input).metadata();
  const aspect = job.display.width / job.display.height;

  // Centre-crop to the frame's aspect ratio at full source height.
  const cropW = Math.min(meta.width, Math.round(meta.height * aspect));
  const cropH = Math.round(cropW / aspect);
  const region = {
    left: Math.round((meta.width - cropW) / 2),
    top: Math.round((meta.height - cropH) / 2),
    width: cropW,
    height: cropH,
  };

  for (const scale of [1, 2]) {
    const w = Math.min(job.display.width * scale, cropW);
    const h = Math.round(w / aspect);
    const base = sharp(input).extract(region).resize(w, h, { fit: "cover" });
    const suffix = scale === 1 ? "" : "@2x";

    const webp = path.join(OUT, `${job.name}${suffix}.webp`);
    await base.clone().webp({ quality: 80 }).toFile(webp);
    console.log(`${webp}  ${w}×${h}  ${await kb(webp)}`);

    // JPEG fallback only at 2x (browsers without WebP are rare).
    if (scale === 2) {
      const jpg = path.join(OUT, `${job.name}.jpg`);
      await base.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(jpg);
      console.log(`${jpg}  ${w}×${h}  ${await kb(jpg)}`);
    }
  }
  console.log(`(source ${input}: ${meta.width}×${meta.height}, ${await kb(input)})`);
}
