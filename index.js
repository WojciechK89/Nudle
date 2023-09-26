

const puppeteer = require("puppeteer");

const tesseract = require("tesseract.js");
const Ocr = require('./src/ocr');
const {
  sleep
} = require('./src/helpers');

(async () => {
  const ocr = new Ocr();
  await ocr.init();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://lerex-prepoduction.d3pj531ws5mydw.amplifyapp.com/#/login", { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    window.onclick = (event) => console.log(event.x, event.y)
  });
  // Find the application to load
  const panel = await page.waitForSelector("flt-glass-pane");
  // wait 1s to be sure
  await sleep(1000);


  const screenshot = await page.screenshot({ type: 'jpeg', quality: 100 });
  const result = await ocr.recognize(screenshot);
  const emailCoords = result.getElementsByText('Email')[0];
  const passwordCoords = result.getElementsByText('Password');
  const ContactsCoords = result.getElementsByText('Search Contacts');
  const loginButton = result.getElementsByText('Login')[1];
  console.log(passwordCoords)


  await clickAndType(page, emailCoords, 'email@gmail.ocm');
  await clickAndType(page, passwordCoords[0], '!1234qWE');
  await clickAndType(page, ContactsInput[0], '!1234qWE');

  await page.mouse.click(loginButton.x, loginButton.y);
  await sleep(10000);

  await browser.close();

  await ocr.terminate();
})();

async function clickAndType(page, coords, text) {
  await page.mouse.click(coords.x, coords.y);
  const input = await page.waitForSelector(">>>input");
  await input.type(text);
  await sleep(500);
}
