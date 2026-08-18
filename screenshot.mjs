import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const [, , url, label] = process.argv;

if (!url) {
  console.error("Usage: node screenshot.mjs <url> [label]");
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), "temporary screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

function nextScreenshotPath(label) {
  const existing = fs.readdirSync(OUT_DIR);
  let n = 1;
  for (const name of existing) {
    const match = name.match(/^screenshot-(\d+)/);
    if (match) n = Math.max(n, parseInt(match[1], 10) + 1);
  }
  const suffix = label ? `-${label}` : "";
  return path.join(OUT_DIR, `screenshot-${n}${suffix}.png`);
}

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle0" });

  const outPath = nextScreenshotPath(label);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} finally {
  await browser.close();
}
