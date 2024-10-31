const parseFl = require('./../parseTablesFunctions/parse_fl');
const sleep = ms => new Promise(res => setTimeout(res, ms));
const getRandomArbitrarySec = require('../tools/getRandomArbitrarySec');
const scrapeWithCicle = require('./scrapeWithCicle');

console.log("fl_pageController");

const db_table = "ps_fl_freelancers";
const paginationNextPageSelector = "#PrevLink";

async function scrapeAll(browserInstance, URL, flCount)
{
	let browser;
	console.log("\nscrapeAll flCount:", flCount);
	try
	{
		browser = await browserInstance;
		let scrapedData = {};//объект со спарсеными данными

		const flListPage = await browser.newPage().then(console.log("Вкладака открыта..."));//Открываем новую вкладку
		await flListPage.goto(URL, { waitUntil: ['domcontentloaded'] }).then(() => console.log('Страница со списком фрилансеров и пагинацией открыта...'));//Страница со списком фрилансеров и пагинацией
		await sleep(getRandomArbitrarySec(4, 6));

		await scrapeWithCicle(flListPage, flCount, db_table, scrapedData, browser);//Парсим указанное количество фрилансеров
		await sleep(getRandomArbitrarySec(4, 6));//отдыхаем 4-6 секнд
		await parseFl.parseAndSaveToDB(scrapedData, URL).then(async result => { console.log(result) }).catch(err => console.error(err));//записываем результаты

		//browser.close();

		if (await flListPage.$(paginationNextPageSelector) !== null)//если на странице есть элемент возвращающий по клику телефон
		{
			await flListPage.click(paginationNextPageSelector).then(result => console.log(result)).then(async res =>
			{
				while ((await flListPage.$(paginationNextPageSelector) !== null))
				{
					console.log("next page...");
					await sleep(getRandomArbitrarySec(4, 6));

					await scrapeWithCicle(flListPage, flCount, db_table, scrapedData, browser);//Парсим указанное количество фрилансеров
					await sleep(getRandomArbitrarySec(4, 6));//отдыхаем 4-6 секнд
					await parseFl.parseAndSaveToDB(scrapedData, URL).then(async result => { console.log(result) }).catch(err => console.error(err));//записываем результаты
				}

			})
		}

		return scrapedData;
	}
	catch (err)
	{
		console.log("Что-то пошло не так =>\n", err);
	};
};

module.exports = (browserInstance, currentUrl, flCount) => scrapeAll(browserInstance, currentUrl, flCount);