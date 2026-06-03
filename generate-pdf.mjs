import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(dir, 'edit for export-for-pdf.html');
const outPath = path.join(dir, 'PATH-NOMAD-Platform-Sendable.pdf');

if (!fs.existsSync(htmlPath)) {
  console.error('Missing:', htmlPath);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', right: '12mm', bottom: '14mm', left: '12mm' },
});
await browser.close();

const stat = fs.statSync(outPath);
console.log('Wrote:', outPath);
console.log('Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');