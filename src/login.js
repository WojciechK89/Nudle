

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://lerex-prepoduction.d3pj531ws5mydw.amplifyapp.com/#/login", { waitUntil: 'networkidle0' });
  const result = await page.evaluate(() => {
    window.onclick = (event) => console.log(event.x, event.y)

  });
  // Find the iframe
  const panel = await page.waitForSelector("flt-glass-pane");
  // Find its coordinates
  const rect = await page.evaluate(el => {
    const { x, y, width, height } = el.getBoundingClientRect();
    return { x, y, width, height };
  }, panel);
  console.log(rect)

  // Values found manually by doing 
  // `document.querySelector('.yscp_link').getBoundingClientRect()`
  // in the dev console. Add 5 to them, because it's the top left corner
  const email = { x: 280, y: 291 };
  const password = { x: 275, y: 347 };
  const loginButton = { x: 452, y: 431 };

  // for (let x = 200; x < rect.width; x = x + 10) {
  //   for (let y = 0; y < rect.height; y = y + 10) {
  //     console.log('clicking', x,y )

  //   }
  // }

  await new Promise((r) => setTimeout(r, 1000))

  


  await new Promise((r) => setTimeout(r, 1000))
  await page.mouse.click(email.x, email.y);
  const emailInput = await page.waitForSelector(">>>input");
  await emailInput.type('email@gmail.ocm');
  await new Promise((r) => setTimeout(r, 2000))
  await page.mouse.click(password.x, password.y);
  await new Promise((r) => setTimeout(r, 2000))
  const passwordInput = await page.waitForSelector(">>>input");
  await passwordInput.type('Password123!');
  await new Promise((r) => setTimeout(r, 2000))
  await page.mouse.click(loginButton.x, loginButton.y);
  await new Promise((r) => setTimeout(r, 2000))
  await page.screenshot({ path: "example.png" });
    await new Promise((r) => setTimeout(r, 3000))
  await browser.close();

})();