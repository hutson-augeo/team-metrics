/**
 * screenshot.js
 * Captures a full-page screenshot of every dashboard tab.
 *
 * Usage:
 *   1. In one terminal: npm run dev
 *   2. In another:      npm run screenshots
 *
 * Output: docs/screenshots/<tab-name>.png
 */

import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../docs/screenshots");

// Accept an optional port or full URL as a CLI arg:
//   npm run screenshots          ← auto-detect
//   npm run screenshots -- 5175  ← explicit port
const cliArg = process.argv[2];

async function resolveBaseUrl() {
  if (cliArg) {
    const url = cliArg.startsWith("http") ? cliArg : `http://localhost:${cliArg}`;
    console.log(`→ Using explicit URL: ${url}\n`);
    return url;
  }
  // Auto-detect: find port serving a Vite app (has /@vite/client in HTML)
  for (const port of [5173, 5174, 5175, 5176, 5177, 5178, 5179]) {
    try {
      const res = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(1000) });
      if (!res.ok) continue;
      const html = await res.text();
      if (html.includes("/@vite/client")) {
        console.log(`→ Auto-detected Vite server at http://localhost:${port}\n`);
        return `http://localhost:${port}`;
      }
    } catch { /* port not open or wrong server, try next */ }
  }
  return null;
}

// Maps tab key to output filename and a plain-text match string (no emoji)
const TABS = [
  { file: "overview.png",     match: "Overview" },
  { file: "ai-tokens.png",    match: "AI & Tokens" },
  { file: "delivery.png",     match: "Delivery" },
  { file: "tech-health.png",  match: "Tech Health" },
  { file: "gsm-table.png",    match: "GSM Table" },
  { file: "integrations.png", match: "Integrations" },
  { file: "about.png",        match: "About" },
];

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wide viewport so charts render at full desktop width
  await page.setViewportSize({ width: 1440, height: 900 });

  const BASE_URL = await resolveBaseUrl();
  if (!BASE_URL) {
    console.error("\n✖ No Vite dev server found on ports 5173–5179.");
    console.error("  Make sure the dev server is running: npm run dev\n");
    await browser.close();
    process.exit(1);
  }
  console.log(`→ Found dev server at ${BASE_URL}\n`);

  // "load" avoids hanging on Vite's HMR WebSocket which blocks "networkidle"
  await page.goto(BASE_URL, { waitUntil: "load", timeout: 15_000 });

  // Wait for React to render — the dashboard header is always present
  await page.waitForSelector("h1", { timeout: 10_000 });

  for (const tab of TABS) {
    // Match button by plain text — avoids emoji encoding issues in the a11y tree
    await page.locator("button", { hasText: tab.match }).first().click();

    // Let charts animate in
    await page.waitForTimeout(400);

    const outPath = resolve(OUT_DIR, tab.file);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`✔ ${tab.match.padEnd(18)} → docs/screenshots/${tab.file}`);
  }

  await browser.close();
  console.log("\nDone. All screenshots saved to docs/screenshots/");
}

run();
