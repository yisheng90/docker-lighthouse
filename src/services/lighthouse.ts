import * as lighthouse from "lighthouse";
import * as puppeteer from "puppeteer";
import { throttling, screenEmulationMetrics } from "./constants";
import { DeviceType } from "../entities/device-type";
const desktopDense4G = throttling.desktopDense4G;
const mobileSG4G = throttling.mobileSG4G;

const getLighthouseOptions = (device: DeviceType) => {
  const options: any = {
    output: "json",
    throttling: mobileSG4G,
    formFactor: device,
    screenEmulation: screenEmulationMetrics.mobile,
    onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
    port: 9222,
  };

  if (device === DeviceType.DESKTOP) {
    options.throttling = desktopDense4G;
    options.screenEmulation = screenEmulationMetrics.desktop;
  }

  return options;
};

export const runLighthouse = async (
  url: string,
  device: DeviceType = DeviceType.MOBILE
) => {
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

    const report = await lighthouse(url, getLighthouseOptions(device));

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

export default runLighthouse;
