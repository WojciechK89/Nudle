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

	describe('Opening Login page', function () {
		it('should be able to login', async function () {
			await login();
			await waitForText('My Balance')
		});

		it('should be able to login and logout after 95 seconds', async function () {
			await login();
			await sleep(96000);
			await waitForText('logout due to inactivity')
		});
	});


	describe('Opening sub pages', function () {
		it('Should be able to open my money section', async function () {
			await login();
			await clickAtText('MY MONEY')
			await waitForText('MY WALLETS')

		});
		it('Should be able to open More section', async function () {
			await login();
			await clickAtText('MORE')
			await waitForText('MY CONTACTS')
		});
		it('Should be able to open More section', async function () {
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

