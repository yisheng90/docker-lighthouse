import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import { throttling, screenEmulationMetrics } from "./constants.js";
const desktopDense4G = throttling.desktopDense4G;
const mobileSG4G = throttling.mobileSG4G;

export const runLighthouse = async (url, device = "mobile") => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=9222",
        "--remote-debugging-address=0.0.0.0",
      ],
      ignoreDefaultArgs: ["--disable-extensions"],
    });

    const options = {
      output: "json",
      throttling: device == "desktop" ? desktopDense4G : mobileSG4G,
      formFactor: device,
      screenEmulation:
        device == "desktop"
          ? screenEmulationMetrics.desktop
          : screenEmulationMetrics.mobile,
      onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
      port: 9222,
    };

    const report = await lighthouse(url, options);

    await browser.close();

    return report.report;
  } catch (err) {
    console.log(err);
    if (browser) {
      await browser.close();
    }

    return;
  }
};
