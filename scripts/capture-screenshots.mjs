import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const out = '/opt/cursor/artifacts/screenshots';
const base = 'http://127.0.0.1:8765';

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

await page.goto(`${base}/concepts-gallery.html`, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}/00-concepts-gallery-full.png`, fullPage: true });
for (let i = 1; i <= 10; i++) {
  const el = page.locator(`#concept-${i}`);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: `${out}/concept-${String(i).padStart(2, '0')}.png` });
}

await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  document.getElementById('boot-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  session = {
    name: 'Push Day',
    exercises: [
      { name: 'Bench Press', sets: [{ reps: '8', weight: '185', note: '' }, { reps: '8', weight: '185', note: '' }] },
      { name: 'OHP', sets: [{ reps: '10', weight: '115', note: '' }] },
    ],
  };
  initLog();
  document.getElementById('sn').value = 'Push Day';
  session = {
    name: 'Push Day',
    exercises: [
      { name: 'Bench Press', sets: [{ reps: '8', weight: '185', note: '' }, { reps: '8', weight: '185', note: '' }] },
      { name: 'OHP', sets: [{ reps: '10', weight: '115', note: '' }] },
    ],
  };
  renderExList();
  workouts = [{
    id: 1,
    name: 'Push Day',
    date: new Date().toISOString(),
    exercises: [{ name: 'Bench Press', sets: [{ reps: '8', weight: '185', note: '' }] }],
  }];
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/app-01-log.png` });

await page.evaluate(() => goTab('history', document.querySelector('.tab-rail button:nth-child(2)')));
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/app-02-history.png` });

await page.evaluate(() => goTab('dashboard', document.querySelector('.tab-rail button:nth-child(3)')));
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/app-03-stats.png` });

await page.evaluate(() => goTab('import', document.querySelector('.tab-rail button:nth-child(4)')));
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/app-04-import.png` });

await browser.close();
console.log('saved to', out);
