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
const BASE_URL = "http://localhost:5173";

// Maps tab key (matches the button data in App.jsx) to output filename
const TABS = [
  { key: "overview",     file: "overview.png",     label: "📊 Overview" },
  { key: "ai_tokens",    file: "ai-tokens.png",     label: "🤖 AI & Tokens" },
  { key: "delivery",     file: "delivery.png",      label: "🚀 Delivery" },
  { key: "tech_health",  file: "tech-health.png",   label: "🔧 Tech Health" },
  { key: "gsm_table",    file: "gsm-table.png",     label: "📋 GSM Table" },
  { key: "integrations", file: "integrations.png",  label: "🔌 Integrations" },
  { key: "about",        file: "about.png",         label: "📖 About" },
];

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wide viewport so charts render at full desktop width
  await page.setViewportSize({ width: 1440, height: 900 });

  // Verify dev server is running
  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 10_000 });
  } catch {
    console.error(`\n✖ Could not reach ${BASE_URL}`);
    console.error("  Make sure the dev server is running: npm run dev\n");
    await browser.close();
    process.exit(1);
  }

  for (const tab of TABS) {
    // Click the tab button by its visible text
    await page.getByRole("button", { name: new RegExp(tab.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).click();

    // Let charts animate in
    await page.waitForTimeout(400);

    const outPath = resolve(OUT_DIR, tab.file);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`✔ ${tab.label.padEnd(22)} → docs/screenshots/${tab.file}`);
  }

  await browser.close();
  console.log("\nDone. All screenshots saved to docs/screenshots/");
}

run();
