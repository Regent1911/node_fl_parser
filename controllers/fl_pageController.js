const { _connectToCdpBrowser } = require('puppeteer');
const flPageScraper = require('../scrapers/fl_pageScraper');//
const parseFl = require('./../parseTablesFunctions/parse_fl');
const queryDB = require('../tools/queryDB');
const sleep = ms => new Promise(res => setTimeout(res, ms));
const getRandomArbitrarySec = require('../tools/getRandomArbitrarySec');

async function scrapeAll(browserInstance, URL, flCount)
{
	let browser;
	console.log(URL);
	console.log("scrapeAll flCount", flCount);
	try
	{
		browser = await browserInstance;
		let scrapedData = {};//объект со спарсеными данными

		const flListPage = await browser.newPage();//Открываем новую вкладку
		await flListPage.goto(URL);//Страница со списком резюме и пагинацией
		await sleep(getRandomArbitrarySec(4, 6));

		const isCaptchaPresent = await flListPage.evaluate(() =>
		{
			return document.querySelector('form[name="check_user"]') !== null;
		});
		if (isCaptchaPresent)
		{
			flListPage.screenshot({ path: 'screenshot_captcha.png' });
		}

		async function scrapeWithCicle(flListPage, flCount)
		{
			let flLinksElements = await flListPage.$$('.prof a[href^="/res"][target]');//Берём все элементы со ссылками на резюме
			let count = flCount;
			for (const linkElement of flLinksElements)
			{
				if (count <= 0) return
				const resume_link = await flListPage.evaluate(linkElement => linkElement.href, linkElement);//забираем ссылку из аттрибута href
				let isDuplicate = Boolean;
				let selectQuery = `SELECT \`id_resume\` FROM  \`ps_parsjl_resume\` WHERE resume_url ='${resume_link}'`;
				await queryDB(selectQuery)
					.then(result =>
					{
						if (result.length)
						{ console.log(resume_link, ": is duplicate resume"); isDuplicate = true; } else { isDuplicate = false; }
					});

				if (isDuplicate == true) { continue };//если resume с url url_key уже записано.
				scrapedData[resume_link] = await flPageScraper.scraper(browser, resume_link);//запускаем скрапер по этой ссылке
				count--;
			}
			count = 0;
		};

		await scrapeWithCicle(flListPage, flCount);
		await sleep(getRandomArbitrarySec(4, 6));
		await parseFl.parseAndSaveToDB(scrapedData, URL).then(async result => { console.log(result) }).catch(err => console.error(err));

		//browser.close();
		return scrapedData;
	}
	catch (err)
	{
		console.log("Что-то пошло не так =>\n", err);
	};
};

module.exports = (browserInstance, currentUrl, flCount) => scrapeAll(browserInstance, currentUrl, flCount);