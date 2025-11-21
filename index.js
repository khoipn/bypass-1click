import express from "express";
import playwright from "playwright";

const app = express();

app.get("/", async (req, res) => {
  const shop = req.query.shop;
  const pw = req.query.pw || "12345";

  if (!shop) return res.send("Missing ?shop=");

  let browser;

  try {
    browser = await playwright.chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-background-networking",
        "--disable-software-rasterizer",
        "--disable-breakpad",
        "--no-zygote",
        "--disable-web-security",
      ],
    });

    const page = await browser.newPage();

    await page.goto(`https://${shop}/password`, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    await page.fill('input[type="password"]', pw);
    await page.click('button[type="submit"], input[type="submit"]');

    // Chờ Shopify redirect sau khi nhập password
    await page.waitForNavigation({ timeout: 8000 }).catch(() => {});

    const cookies = await page.context().cookies();
    const digest = cookies.find((c) => c.name === "storefront_digest");

    await browser.close();

    if (!digest) return res.send("Bypass failed. Wrong password?");

    return res.redirect(`https://${shop}/?storefront_digest=${digest.value}`);
  } catch (err) {
    if (browser) await browser.close();
    return res.send("Error: " + err.message);
  }
});

// Railway bắt buộc phải listen PORT như sau
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
