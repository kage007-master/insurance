import Weather from "./models/Weather";
import User from "./models/User";
import Claim from "./models/Claim";
import Coverage from "./models/Coverage";
import CoverageHistory from "./models/CoverageHistory";

const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const events = require("events");

events.EventEmitter.defaultMaxListeners = 15;

const SELECTORS = {
  CONDITION: "/html/body/div/main/section[1]/div[1]/section/h2",
  ZONE: "/html/body/div/main/section[1]/div[1]/section/div[1]/ul",
  TIME: "/html/body/div/main/section/div[1]/section/div/p[1]/time",
};

// Utility function to extract text content from a given XPath selector
async function extractTextFromElement(page: any, xpath: any) {
  try {
    const [element] = await page.$x(xpath);
    return element
      ? (await element.getProperty("textContent")).jsonValue()
      : null;
  } catch (error: any) {
    console.error(`Error extracting from XPath ${xpath}: ${error.message}`);
    return null;
  }
}

async function scrapeData(targetUrl: string) {
  let browserInstance;

  try {
    browserInstance = await puppeteer.launch({ headless: "new" });
    const webpage = await browserInstance.newPage();
    await webpage.goto(targetUrl);

    // List of conditions to check for
    const targetConditions = ["qualité de l'air"];
    const conditionAlert = await extractTextFromElement(
      webpage,
      SELECTORS.CONDITION
    );

    if (conditionAlert) {
      for (let condition of targetConditions) {
        if (conditionAlert.includes(condition)) {
          // Extracting the relevant details from the page
          const relevantZone = await extractTextFromElement(
            webpage,
            SELECTORS.ZONE
          );
          const extractedTime = await extractTextFromElement(
            webpage,
            SELECTORS.TIME
          );

          // Refining extracted data
          const refinedAlert = conditionAlert.replace(
            / en vigueur pour :/g,
            ""
          );
          const refinedZones = relevantZone.replace(/ secteur de /g, " / ");

          const structuredData = {
            Url: targetUrl,
            Type: refinedAlert,
            datetime: extractedTime,
            Zones: refinedZones,
          };

          console.log("Data extracted for condition:", condition);
          return structuredData; // Return the structured data
        }
      }
    } else {
      console.log("No matching conditions found.");
      return null; // Return null if no matching condition found
    }
  } catch (error: any) {
    console.error(`Error during scraping: ${error.message}`);
    return null; // Return null on any error
  } finally {
    // Ensuring that the browser instance is closed
    if (browserInstance) {
      await browserInstance.close();
    }
  }
}

// List of URLs to scrape
const urls = [
  //secteur de Laval
  "https://meteo.gc.ca/warnings/report_f.html?qcrm1=",
  //secteur de l'île de Montréal
  "https://meteo.gc.ca/warnings/report_f.html?qcrm2=",
  //secteur de Châteauguay - La Prairie
  "https://meteo.gc.ca/warnings/report_f.html?qcrm3=",
  //secteur de Longueuil - Varennes
  "https://meteo.gc.ca/warnings/report_f.html?qcrm4=",

  //Active test Amos / baie James et rivière La Grande
  "https://meteo.gc.ca/warnings/report_f.html?qcrm39=",
  "https://meteo.gc.ca/warnings/report_f.html?qc1",
];

const weathers = ["snow", "wind", "freeze"];
const cities = ["Laval", "Montreal", "Longueuil"];

export const warningScrap = async () => {
  // const results = await Promise.all(urls.map((url) => scrapeData(url)));
  // const validResults = results.filter((result) => result !== null); // Remove any null results
  // // Convert the results array into a JSON string and write to the file
  // const jsonData = JSON.stringify(validResults, null, 2);
  // const currentDatetime = new Date();

  // console.log(jsonData);
  const rand = Math.floor(Math.random() * 1000) % 3;
  const rand1 = Math.floor(Math.random() * 1000) % 3;
  const weather = weathers[rand];
  const city = cities[rand1];
  const customers = await User.find({ "address.city": city, role: "customer" });
  const coverage = await Coverage.findOne({ weather });
  let raised_claims = 0;
  const weatherEvent = new Weather({
    weather,
    city,
    url: "https://meteo.gc.ca/warnings/report_f.html?qcrm1=",
    raised_claims,
  });
  await weatherEvent.save();
  for (let i = 0; i < customers.length; i++) {
    const cnt = await CoverageHistory.count({
      clientID: customers[i]._id,
      coverageID: coverage?._id,
      subscription_date: { $lt: new Date() },
      expire_date: { $gt: new Date() },
    });
    if (cnt) {
      let claim = new Claim({
        weather,
        weatherEventID: weatherEvent._id,
        clientID: customers[i]._id,
      });
      await claim.save();
      raised_claims++;
    }
  }
  const _weatherEvent: any = await Weather.findById(weatherEvent._id);
  _weatherEvent.raised_claims = raised_claims;
  await _weatherEvent.save();
};
