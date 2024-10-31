const queryDB = require('../tools/queryDB');
const flPageScraper = require('../scrapers/fl_pageScraper');//
const parseFl = require('./../parseTablesFunctions/parse_fl');

async function scrapeWithCicle(flListPage, flCount, db_table, browser)
{
	const FL_SELECTORS = {
		userCardLink: '[data-id="qa-content-tr-td-user"]>[data-ga-event]',
	}
	let scrapedData = {};

	let flLinksElements = await flListPage.$$(FL_SELECTORS.userCardLink)/*.then(elements => console.log(elements))*/;//Берём все элементы со ссылками на резюме
	let count = flCount;

	for (const linkElement of flLinksElements)
	{
		if (count <= 0) return

		const user_link = await flListPage.evaluate(linkElement => linkElement.href, linkElement);//забираем ссылку из аттрибута href
		let isDuplicate = Boolean;
		let selectQuery = `SELECT \`id_user\` FROM  \`${db_table}\` WHERE userLink  ='${user_link}'`;
		await queryDB(selectQuery).then(result =>
		{
			if (result.length)
			{ console.log(user_link, ": is duplicate freelancer"); isDuplicate = true; } else { isDuplicate = false; }
		});

		if (isDuplicate == true) { continue };//если resume с url url_key уже записано.

		scrapedData[user_link] = await flPageScraper.scraper(browser, user_link);//запускаем скрапер по этой ссылке

		await parseFl.parseAndSaveToDB(scrapedData, URL).then(async result => { console.log(result) }).catch(err => console.error(err));//записываем результаты
		count--;

		scrapedData = {};
	}

	count = 0;
};

module.exports = scrapeWithCicle;