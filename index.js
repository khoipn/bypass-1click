import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/", async (req, res) => {
  const shop = req.query.shop;
  const pw = req.query.pw || "12345";

  if (!shop) return res.send("Missing ?shop=");

  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.goto(`https://${shop}/password`);

    await page.fill('input[type="password"]', pw);
    await page.click('button[type="submit"], input[type="submit"]');

    await page.waitForNavigation({ timeout: 8000 }).catch(() => {});

    const cookies = await page.context().cookies();
    const digest = cookies.find(c => c.name === "storefront_digest");

    await browser.close();

    if (!digest) return res.send("Bypass failed. Wrong password?");

    return res.redirect(`https://${shop}/?storefront_digest=${digest.value}`);
  } catch (err) {
    await browser.close();
    return res.send("Error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
