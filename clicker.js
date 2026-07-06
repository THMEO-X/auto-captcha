const { chromium } = require('playwright');

async function clickNotYou(url = 'https://owobot.com/captcha') {
  const result = { success: false, clicked: false, message: '' };

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
  });

  const page = await context.newPage();

  try {
    console.log(`[clicker] Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Danh sách selector để tìm nút "Not you?"
    const selectors = [
      'text=Not you?',
      'a:has-text("Not you?")',
      'button:has-text("Not you?")',
      'span:has-text("Not you?")',
      '[class*="not-you"]',
      '[id*="not-you"]',
      'a[href*="logout"]',
      'a[href*="switch"]',
    ];

    let clicked = false;

    for (const selector of selectors) {
      try {
        const el = await page.waitForSelector(selector, { timeout: 4000 });
        if (el) {
          console.log(`[clicker] Found element: ${selector}`);
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          await el.click();
          clicked = true;
          result.clicked = true;
          result.success = true;
          result.message = `Clicked via selector: "${selector}"`;
          console.log(`[clicker] ✅ Clicked!`);
          break;
        }
      } catch (_) {
        // thử selector tiếp theo
      }
    }

    // Fallback: evaluate DOM tìm bằng innerText
    if (!clicked) {
      console.log('[clicker] Trying DOM fallback...');
      const fallbackClicked = await page.evaluate(() => {
        const all = document.querySelectorAll('a, button, span, p');
        for (const el of all) {
          if (el.innerText && el.innerText.trim().toLowerCase() === 'not you?') {
            el.click();
            return true;
          }
        }
        return false;
      });

      if (fallbackClicked) {
        result.clicked = true;
        result.success = true;
        result.message = 'Clicked via DOM fallback (innerText match)';
        console.log('[clicker] ✅ Clicked via fallback!');
      } else {
        result.message = 'Element "Not you?" not found on page';
        console.log('[clicker] ❌ Element not found');

        // Debug: dump tất cả text trên page
        const pageText = await page.evaluate(() => document.body.innerText.slice(0, 500));
        console.log('[clicker] Page preview:', pageText);
      }
    }

    await page.waitForTimeout(1000);
  } catch (err) {
    result.message = `Error: ${err.message}`;
    console.error('[clicker] Error:', err.message);
  } finally {
    await browser.close();
  }

  return result;
}

module.exports = { clickNotYou };