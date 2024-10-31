const flPageScraper = require('../scrapers/fl_pageScraper');//
const parseFl = require('./../parseTablesFunctions/parse_fl');
const queryDB = require('../tools/queryDB');
const sleep = ms => new Promise(res => setTimeout(res, ms));
const getRandomArbitrarySec = require('../tools/getRandomArbitrarySec');


console.log("fl_pageController");

const db_table = "ps_fl_freelancers";

async function scrapeAll(browserInstance, URL, flCount)
{
	let browser;
	console.log("scrapeAll flCount", flCount);
	try
	{
		browser = await browserInstance;
		let scrapedData = {};//объект со спарсеными данными

		const flListPage = await browser.newPage().then(console.log("Вкладака открыта..."));//Открываем новую вкладку
		await flListPage.goto(URL, { waitUntil: ['domcontentloaded'] }).then(() => console.log('Страница со списком фрилансеров и пагинацией открыта...'));//Страница со списком фрилансеров и пагинацией
		await sleep(getRandomArbitrarySec(4, 6));

		async function scrapeWithCicle(flListPage, flCount)
		{
			const FL_SELECTORS = {
				userCardLink: '[data-id="qa-content-tr-td-user"]>[data-ga-event]',
			}

			let flLinksElements = await flListPage.$$(FL_SELECTORS.userCardLink)/*.then(elements => console.log(elements))*/;//Берём все элементы со ссылками на резюме
			let count = flCount;

			for (const linkElement of flLinksElements)
			{
				if (count <= 0) return

				const user_link = await flListPage.evaluate(linkElement => linkElement.href, linkElement);//забираем ссылку из аттрибута href
				let isDuplicate = Boolean;
				let selectQuery = `SELECT \`id_user\` FROM  \`${db_table}\` WHERE userLink  ='${user_link}'`;
				await queryDB(selectQuery)
					.then(result =>
					{
						if (result.length)
						{ console.log(user_link, ": is duplicate freelancer"); isDuplicate = true; } else { isDuplicate = false; }
					});

				if (isDuplicate == true) { continue };//если resume с url url_key уже записано.

				scrapedData[user_link] = await flPageScraper.scraper(browser, user_link);//запускаем скрапер по этой ссылке
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