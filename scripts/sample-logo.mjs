// Regenerate the sketchpad example whenever public/logo.svg changes.
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(await readFile(new URL("../public/logo.svg", import.meta.url), "utf8"));
  const points = await page.evaluate(() => {
    const path = document.querySelector("svg path");
    const box = path.getBBox();
    const scale = 156 / Math.max(box.width, box.height);
    const length = path.getTotalLength();
    return Array.from({ length: 128 }, (_, i) => {
      const point = path.getPointAtLength(length * i / 128);
      return {
        x: Number(((point.x - box.x - box.width / 2) * scale).toFixed(4)),
        y: Number(((point.y - box.y - box.height / 2) * scale).toFixed(4)),
      };
    });
  });
  const coordinates = points.map((point) => `  { x: ${point.x}, y: ${point.y} },`).join("\n");
  const source = '// Generated from public/logo.svg by node scripts/sample-logo.mjs.\nimport type { Point } from "./fourier";\n\nexport const logoExample: Point[] = [\n' + coordinates + '\n];\n';
  await writeFile(new URL("../lib/fourier-logo.ts", import.meta.url), source);
} finally {
  await browser.close();
}
