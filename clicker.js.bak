const puppeteer = require('puppeteer');

async function clickNotYou(url = 'https://owobot.com/captcha') {
  const result = { success: false, clicked: false, message: '' };

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/124.0.0.0 Safari/537.36'
  );

  try {
    console.log(`[clicker] Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Tìm và click "Not you?" bằng DOM evaluate
    const clicked = await page.evaluate(() => {
      const tags = document.querySelectorAll('a, button, span, p, div');
      for (const el of tags) {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (text === 'not you?') {
          el.click();
          return { found: true, tag: el.tagName, text: el.innerText };
        }
      }
      // Partial match fallback
      for (const el of tags) {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (text.includes('not you')) {
          el.click();
          return { found: true, tag: el.tagName, text: el.innerText };
        }
      }
      return { found: false };
    });

    if (clicked.found) {
      result.clicked = true;
      result.success = true;
      result.message = `Clicked <${clicked.tag}> "${clicked.text}"`;
      console.log('[clicker] ✅', result.message);
    } else {
      // Debug: in ra page text để xem có gì
      const preview = await page.evaluate(() => document.body.innerText.slice(0, 800));
      result.message = 'Not found. Page preview: ' + preview;
      console.log('[clicker] ❌ Not found');
      console.log('[clicker] Page text:', preview);
    }

  } catch (err) {
    result.message = 'Error: ' + err.message;
    console.error('[clicker]', err.message);
  } finally {
    await browser.close();
  }

  return result;
}

module.exports = { clickNotYou };