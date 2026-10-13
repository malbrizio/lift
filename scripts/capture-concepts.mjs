import puppeteer from 'puppeteer-core';
import { mkdir, copyFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import path from 'path';

const chrome = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const srcDir = '/workspace/concept-mocks';
const outDir = '/workspace/screenshots';
const artifactsDir = '/opt/cursor/artifacts/screenshots';

await mkdir(outDir, { recursive: true });
await mkdir(artifactsDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--user-data-dir=/tmp/chrome-screenshots'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.html')).sort();
for (const file of files) {
  const url = `file://${path.join(srcDir, file)}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const name = file.replace('.html', '.png');
  const dest = path.join(outDir, name);
  await page.screenshot({ path: dest, type: 'png' });
  await copyFile(dest, path.join(artifactsDir, name));
  console.log('wrote', name);
}

await browser.close();
console.log('done', files.length);
