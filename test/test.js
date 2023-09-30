const assert = require('assert');
const puppeteer = require("puppeteer");

const Ocr = require('../src/ocr');

const { BUTTONS } = require('../src/elements')
const {
	sleep,
	clickAndType,
	waitFor,
	typeText,
	clickAndTypeText,
	clickAtText,
	waitForText
} = require('../src/helpers');
const {
	EMAIL,
	PASSWORD,
	URL,
	defaultViewport
} = require('../config.js');

describe('Swapix automation', function () {

	let ocr;
	let browser;
	let page;
	let context;

	before(async function () {
		ocr = new Ocr();
		await ocr.init();
	});

	after(async function () {
		await ocr.terminate();
	});

	beforeEach(async function () {
		browser = await puppeteer.launch({ headless: false, defaultViewport });
		page = await browser.newPage();
		await page.goto(URL, { waitUntil: 'networkidle0' });

		await page.waitForSelector("flt-glass-pane");
		await sleep(1000);
		await page.evaluate(() => {
			window.onclick = (event) => console.log(event.x, event.y)
		  });

		context = {
			ocr,
			browser,
			page,
		}
	});

	afterEach(async function () {
		await browser.close();
	});

	describe('Opening Login page and auto logout', function () {
		it('should be able to login', async function () {
			await login();
			await waitForText(context, 'GBP')
		});

		it('should be able to login and logout after 95 seconds', async function () {
			await login();
			await sleep(96000);
			await waitForText(context, 'logout due to inactivity')
		});
	});


	describe('Opening main pages', function () {


		it('Should be able to open MY BALANCE section section', async function () {
			await login();
			await clickAtText(context, 'GBP')
			await waitForText(context, '2023')
		});


		it('Should be able to open my money section and then my wallet activity', async function () {
			await login();
			await clickAtText(context, 'MY MONEY')
			await waitForText(context, 'MY WALLETS')
			//await sleep(1000);
			// await clickAtText(context, 'Back');
			// await clickAtText(context, 'MY SPENDING')
			// await waitForText(context, 'MY SPENDING')
			// await sleep(1000);w
			await clickAtText(context, 'Activity', 0);
			await clickAtText(context, 'Back');
			//await sleep(3000)
			//await clickAtText(context, 'Activity', 1);
			
			//

			await sleep(1000)
			//await waitForText('MANAGE MY CARD(S)')

		});

		/*it.skip('Should be able to open My Spending section', async function () {
			await login();
			await clickAtText('MY SPENDING')
			await waitForText('MY SPENDING')
			await sleep(1000);
		});
		*/


		it('Open My Security main section', async function () {
			await login();
			await clickAtText(context, 'MY SECURITY');
			await clickAtText(context, 'CARD SECURITY');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'CHANGE MY PASSWORD');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'CONFIGURE');
			await clickAtText(context, 'Back');
			await clickAtText(context, '2 FACTOR AUTHENTICATION');
			await clickAtText(context, 'Back');

		});

		it('Should be able to open My Physical Card section', async function () {
			await login();
			await clickAtText(context, 'MY SECURITY');
			await clickAtText(context, 'CARD SECURITY');
			await clickAtText(context, 'MY PHYSICAL');
			await clickAtText(context, 'CHANGE MY PIN');
			await sleep(5000)
			await page.mouse.click(BUTTONS.CANCELL.x, BUTTONS.CANCELL.y);
			//await clickAtText('Cancel');

			await clickAtText(context, 'RETRIEVE MY PIN');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'MANAGE PERMISSIONS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'BLOCK MY CARD');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'REPORT MY CARD LOST OR STOLEN');
			await clickAtText(context, 'Back');
			await sleep(1000);
		});

		it('Should be able to open My Virtual Card section', async function () {
			await login();
			await clickAtText(context, 'MY SECURITY');
			await clickAtText(context, 'CARD SECURITY');
			await clickAtText(context, 'MY VIRTUAL');
			await clickAtText(context, 'MANAGE PERMISSIONS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'BLOCK MY CARD');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'REPORT MY CARD LOST OR STOLEN');
			await clickAtText(context, 'Back');
			//await clickAtText('Cancel');

			await sleep(1000);
		});



		it('Open My Settings main section', async function () {
			await login();
			await clickAtText(context, 'MY SETTINGS');
			await clickAtText(context, 'MANAGE MY CARD');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'ACCOUNT DETAILS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'MANAGE BENEFICIARIES');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'UPDATE MY DETAILS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'CHANGE MY PASSWORD');
			await clickAtText(context, 'Back');

		});

		it('Should be able to open My Physical Card section', async function () {
			await login();
			await clickAtText(context, 'MY SETTINGS');
			await clickAtText(context, 'MANAGE MY CARD(S)');
			await clickAtText(context, 'MY PHYSICAL');

			await clickAtText(context, 'ATM Withdrawals');

			await clickAtText(context, 'POS In-store transactions');


			await clickAtText(context, 'E-Commerce transactions');

			await clickAtText(context, 'Mail & Phone transactions');

			await clickAtText(context, 'Contactless transactions');

			await sleep(1000);
		});

		it('Should be able to open My Physical Card section', async function () {
			await login();
			await clickAtText(context, 'MY SETTINGS');
			await clickAtText(context, 'MANAGE MY CARD(S)');
			await clickAtText(context, 'MY VIRTUAL');
			await clickAtText(context, 'Back');
			await sleep(1000);
		});

		it('Should be able to open My Virtual Card section', async function () {
			await login();
			await clickAtText(context, 'MY SETTINGS');
			await clickAtText(context, 'CARD SECURITY');
			await clickAtText(context, 'MY VIRTUAL');
			await clickAtText(context, 'MANAGE PERMISSIONS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'BLOCK MY CARD');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'REPORT MY CARD LOST OR STOLEN');
			await clickAtText(context, 'Back');
			//await clickAtText('Cancel');

			await sleep(1000);
		});


		it('Should be able to open  More section', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'MY CONTACTS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'MY LIMITS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'MY FEES');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'FX CALCULATOR');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'MY NOTIFICATIONS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'EXPORT MY TRANSACTIONS');
			await clickAtText(context, 'Back');
			await clickAtText(context, 'CONTACT US');
			await clickAtText(context, 'Back');
		});

		//More section pages openig in the new window
		it('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'TERMS AND CONDITIONS');
			await sleep(1500);
		});
		it('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'PRIVACY POLICY');
			await sleep(2000);
		});
		it('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'FAQ');
			await sleep(3000);

		});

		it('Should be able to open More section', async function () {
			await login();
			await clickAtText(context, 'MORE')
			await clickAtText(context, 'MY CONTACTS')
			await clickAtText(context, 'INVITE YOUR FRIENDS')
			//await waitForText('MY CONTACTS')
		});

		it('Should be able to open  My Contacts section and search user', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'MY CONTACTS');
			await clickAndTypeText(context, 'Search Contacts', 'jo')
			await waitForText(context, 'VIGURI')
			await sleep(5000)


		});

		// it.only('Should be able to open  My Contacts section and invite user', async function () {
		// 	await login();
		// 	await clickAtText(context, 'MORE');
		// 	await clickAtText(context, 'MY CONTACTS');
		// 	await clickAtText(context, 'INVITE YOUR FRIENDS');
		// 	await sleep(5000)
		// });

		it.only('Should be able to open  My Contacts section and invite user', async function () {
			await login();
			await clickAtText(context, 'MORE');
			await clickAtText(context, 'MY CONTACTS');
			//await clickAtText(context, 'FRIENIIS');
			await sleep(3000)
			await page.mouse.click(BUTTONS.INVITEYOURFRIENDS.X, BUTTONS.INVITEYOURFRIENDS.Y);
			await sleep(3000)
			await clickAndTypeText(context, 'First name', 'Witold');
		});


	});

	async function login() {
		const screenshot = await page.screenshot({ type: 'jpeg', quality: 100 });
		const result = await ocr.recognize(screenshot);
		const emailCoords = result.getElementsByText('Email')[0];
		const passwordCoords = result.getElementsByText('Password');
		const loginButton = result.getElementsByText('Login')[1];
		await clickAndType(context, emailCoords, EMAIL);
		await clickAndType(context, passwordCoords[0], PASSWORD);
		await page.mouse.click(loginButton.x, loginButton.y);
	}

});

