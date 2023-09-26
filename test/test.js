const assert = require('assert');
const puppeteer = require("puppeteer");
const { expect } = require('chai');
const Ocr = require('../src/ocr');

const {
	sleep,
	clickAndType,
	waitFor
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
	});

	afterEach(async function () {
		await browser.close();
	});

	describe('Opening Login page and auto logout', function () {
		it.skip('should be able to login', async function () {
			await login();
			await waitForText('GBP')
		});

		it.skip('should be able to login and logout after 95 seconds', async function () {
			await login();
			await sleep(96000);
			await waitForText('logout due to inactivity')
		});
	});


	describe('Opening main pages', function () {


		it.skip('Should be able to open MY BALANCE section section', async function () {
			await login();
			await clickAtText('GBP')
			await waitForText('2023')
		});


		it.skip('Should be able to open my money section and then my wallet activity', async function () {
			await login();
			await clickAtText('MY MONEY')
			await waitForText('MY WALLETS')
			await sleep(1000);
			await clickAtText('Back');
			await clickAtText('MY SPENDING')
			await waitForText('MY SPENDING')
			await sleep(1000);
			//await waitForText('My Wallet Activity')
			//await waitForText('MANAGE MY CARD(S)')

		});

		/*it.skip('Should be able to open My Spending section', async function () {
			await login();
			await clickAtText('MY SPENDING')
			await waitForText('MY SPENDING')
			await sleep(1000);
		});
		*/


		it.skip('Open My Security main section', async function () {
			await login();
			await clickAtText('MY SECURITY');
			await clickAtText('CARD SECURITY');
			await clickAtText('Back');
			await clickAtText('CHANGE MY PASSWORD');
			await clickAtText('Back');
			await clickAtText('CONFIGURE');
			await clickAtText('Back');
			await clickAtText('MANAGE BIOMETRICS');
			await clickAtText('Back');
			//this one not working now
			await clickAtText('TWO FACTOR AUTHENTICATION');
			await clickAtText('Back');

		});

		it.skip('Should be able to open My Security section', async function () {
			await login();
			await clickAtText('MY SECURITY')
			await waitForText('CARD SECURITY')
			await sleep(1000);
		});



		it.skip('Open My Settings main section', async function () {
			await login();
			await clickAtText('MY SETTINGS');
			await clickAtText('MANAGE MY CARD');
			await clickAtText('Back');
			await clickAtText('ACCOUNT DETAILS');
			await clickAtText('Back');
			await clickAtText('MANAGE BENEFICIARIES');
			await clickAtText('Back');
			await clickAtText('UPDATE MY DETAILS');
			await clickAtText('Back');
			await clickAtText('CHANGE MY PASSWORD');
			await clickAtText('Back');

		});


		it('Should be able to open  More section', async function () {
			await login();
			await clickAtText('MORE');
			await clickAtText('MY CONTACTS');
			await clickAtText('Back');
			await clickAtText('MY LIMITS');
			await clickAtText('Back');
			await clickAtText('MY FEES');
			await clickAtText('Back');
			await clickAtText('FX CALCULATOR');
			await clickAtText('Back');
			await clickAtText('MY NOTIFICATIONS');
			await clickAtText('Back');
			await clickAtText('EXPORT MY TRANSACTIONS');
			await clickAtText('Back');
			await clickAtText('CONTACT US');
			await clickAtText('Back');
		});

		//More section pages openig in the new window
		it.skip('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText('MORE');
			await clickAtText('TERMS AND CONDITIONS');
			await sleep(1500);
		});
		it.skip('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText('MORE');
			await clickAtText('PRIVACY POLICY');
			await sleep(2000);
		});
		it.skip('Should be able to open  More section-FAQ', async function () {
			await login();
			await clickAtText('MORE');
			await clickAtText('FAQ');
			await sleep(3000);

		});

		it.skip('Should be able to open More section', async function () {
			await login();
			await clickAtText('MORE')
			await clickAtText('MY CONTACTS')
			await clickAtText('INVITE YOUR FRIENDS')
			//await waitForText('MY CONTACTS')
		});

		it.skip('Should be able to open  My Contacts section', async function () {
			await login();
			await clickAtText('MORE');
			await clickAtText('MY CONTACTS');
			await waitForText('Tell your');
		});

	});

	async function login() {
		const screenshot = await page.screenshot({ type: 'jpeg', quality: 100 });
		const result = await ocr.recognize(screenshot);
		const emailCoords = result.getElementsByText('Email')[0];
		const passwordCoords = result.getElementsByText('Password');
		const loginButton = result.getElementsByText('Login')[1];
		await clickAndType(page, emailCoords, EMAIL);
		await clickAndType(page, passwordCoords[0], PASSWORD);
		await page.mouse.click(loginButton.x, loginButton.y);

	}

	async function clickAtText(text, index = 0) {
		await waitForText(text);
		const screenshot = await page.screenshot({ type: 'jpeg', quality: 100 });
		const result = await ocr.recognize(screenshot);
		const coords = result.getElementsByText(text)[index];
		await page.mouse.click(coords.x, coords.y);
	}

	async function waitForText(text) {
		await waitFor(async () => {
			const screenshot = await page.screenshot({ type: 'jpeg', quality: 100 });
			const result = await ocr.recognize(screenshot);
			const elements = result.getElementsByText(text);
			expect(elements.length).to.be.least(1);
		}, 20);
	}

});

