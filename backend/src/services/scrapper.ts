import Weather from "../models/Weather";
import User from "../models/User";
import Claim from "../models/Claim";
import Coverage from "../models/Coverage";
import CoverageHistory from "../models/CoverageHistory";
import interactor from "./interactor";
import Notification from "../models/Notification";
import {
  APPROVED_BY_CUSTOMER,
  APPROVED_BY_TRHESHOLD,
  AUTO_DECLINED,
  AWAITING_VALIDATOR,
  PENDING,
} from "../config/const";
import Setting from "../models/Setting";

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
    const converages = await Coverage.find({});
    const targetConditions = converages.map((coverage: any) => coverage.name);

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
  "https://weather.gc.ca/warnings/report_e.html?qcrm1=",
  //secteur de l'île de Montréal
  "https://weather.gc.ca/warnings/report_e.html?qcrm2=",
  //secteur de Longueuil - Varennes
  "https://weather.gc.ca/warnings/report_e.html?qcrm4=",
  //secteur de Châteauguay - La Prairie
  // "https://meteo.gc.ca/warnings/report_f.html?qcrm3=",

  // //Active test Amos / baie James et rivière La Grande
  // "https://meteo.gc.ca/warnings/report_f.html?qcrm39=",
  // "https://meteo.gc.ca/warnings/report_f.html?qc1",
];

const weathers = ["snow", "wind", "freeze"];
const cities = ["Laval", "Montreal", "Longueuil"];

const addEvent = async (
  weather: string,
  city: string,
  url: string,
  fake: string,
  date: string
) => {
  const employee: any = await User.findOne({ role: "employee" });
  const customers = await User.find({
    "address.city": city,
    role: "customer",
  });
  const coverage = await Coverage.findOne({ weather });
  let raised_claims = 0;
  const weatherEvent = new Weather({ url, fake });
  await weatherEvent.save();
  const notification = new Notification({
    clientID: employee._id,
    title: "New Weather Event Added",
    content: `New weather event is detected. EventID: ${weatherEvent._id}`,
    date: new Date(),
  });
  await notification.save();
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
        date: new Date(),
      });
      await claim.save();
      await interactor.CreateClaim(
        claim._id as string,
        weather,
        weatherEvent._id as string,
        customers[i]._id as string,
        date
      );
      const notification = new Notification({
        clientID: customers[i]._id,
        title: "New Claim Raised",
        content: `New claim is raised. ClaimID: ${claim._id}`,
        date: new Date(),
      });
      await notification.save();
      raised_claims++;
    }
  }
  await interactor.CreateEvent(
    weatherEvent._id as string,
    weather,
    city,
    new Date().toISOString(),
    raised_claims
  );
};

export const warningScrap = async (socket: any) => {
  const settings = await Setting.find({});
  const duration =
    (settings.length
      ? settings[0].duration *
        (settings[0].unit === "m" ? 1 : settings[0].unit === "h" ? 60 : 1440)
      : 10) *
    60 *
    1000;
  const employee: any = await User.findOne({ role: "employee" });
  const unconfirmed_claims = await Claim.find({
    status: PENDING,
  });
  for (let i = 0; i < unconfirmed_claims.length; i++) {
    const notification = new Notification({
      clientID: unconfirmed_claims[i].clientID,
      title: "Claim Declined",
      content: `Claim is auto declined. ClaimID: ${unconfirmed_claims[i]._id}`,
      date: new Date(),
    });
    await notification.save();
  }
  await Claim.updateMany({ status: PENDING }, { status: AUTO_DECLINED });
  const active_weathers = await interactor.GetAllEvents("true");
  for (let i = 0; i < active_weathers.length; i++) {
    const coverage = await Coverage.findOne({
      weather: active_weathers[i].weather,
    });
    const confirmed_claims = await Claim.find({
      status: APPROVED_BY_CUSTOMER,
      weatherEventID: active_weathers[i].ID,
    });
    if (
      (active_weathers[i].confirmed * 100) / active_weathers[i].raised >=
      coverage?.threshold
    ) {
      for (let j = 0; j < confirmed_claims.length; j++) {
        await interactor.TransferAsset(
          confirmed_claims[j].clientID as string,
          -coverage?.reimbursement,
          new Date().toISOString()
        );
        const notification = new Notification({
          clientID: confirmed_claims[j].clientID,
          title: "Claim Approved",
          content: `Claim is approved by threshold. ClaimID: ${confirmed_claims[j]._id}`,
          date: new Date(),
        });
        await notification.save();
      }
      await Claim.updateMany(
        {
          status: APPROVED_BY_CUSTOMER,
          weatherEventID: active_weathers[i].ID,
        },
        { status: APPROVED_BY_TRHESHOLD }
      );
    } else {
      const validator: any = await User.findOne({
        role: "validator",
        "address.city": active_weathers[i].city,
        active: true,
      });
      for (let j = 0; j < confirmed_claims.length; j++) {
        const notification = new Notification({
          clientID: confirmed_claims[j].clientID,
          title: "Awaiting Validator",
          content: `Claim is awaiting validator. ClaimID: ${confirmed_claims[j]._id}`,
          date: new Date(),
        });
        await notification.save();
        const notification1 = new Notification({
          clientID: validator._id,
          title: "Claim Assigned",
          content: `Claim is assgined. ClaimID: ${confirmed_claims[j]._id}`,
          date: new Date(),
        });
        await notification1.save();
      }
      await Claim.updateMany(
        {
          status: APPROVED_BY_CUSTOMER,
          weatherEventID: active_weathers[i].ID,
        },
        { status: AWAITING_VALIDATOR, validatorID: validator._id }
      );
    }
    const notification = new Notification({
      clientID: employee._id,
      title: "Weather Event Ended",
      content: `Weather event is ended. EventID: ${active_weathers[i].ID}`,
      date: new Date(),
    });
    await notification.save();
  }
  await interactor.EndEvents();

  const rand = Math.floor(Math.random() * 1000) % 3;
  const rand1 = Math.floor(Math.random() * 1000) % 3;
  await addEvent(
    weathers[rand],
    cities[rand1],
    urls[rand1],
    "Test Event",
    new Date().toString()
  );
  const results = await Promise.all(urls.map((url) => scrapeData(url)));
  const validResults = results.filter((result) => result !== null); // Remove any null results
  for (let i = 0; i < validResults.length; i++)
    await addEvent(
      validResults[i]?.Type,
      validResults[i]?.Zones,
      validResults[i]?.Url as string,
      "Real Event",
      validResults[i]?.datetime
    );
  socket.broadcast();
  setTimeout(() => warningScrap(socket), duration);
};

// export const Init = async () => {
//   await User.updateOne({email:"employee@gmail.com"}, {role: "employee"});
// }