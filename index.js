const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  const page = await browser.newPage();

  await page.goto("https://owobot.com/captcha", {
    waitUntil: "networkidle2"
  });

  // Tô viền xanh để dễ thấy
  await page.$eval("#not-you", el => {
    el.style.outline = "4px solid blue";
  });

  // Đợi phần tử xuất hiện
  await page.waitForSelector("#not-you");

  // Click
  await page.click("#not-you");

  // Đợi chuyển trang
  await page.waitForNavigation({
    waitUntil: "networkidle2"
  });

  console.log("Đã chuyển tới:", page.url());

  await browser.close();
})();
