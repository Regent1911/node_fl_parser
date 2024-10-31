
const sleep = ms => new Promise(res => setTimeout(res, ms));
const getRandomArbitrarySec = require('../tools/getRandomArbitrarySec');
const scrapeWithCicle = require('./scrapeWithCicle');

console.log("fl_pageController");

const db_table = "ps_fl_freelancers";
const paginationNextPageSelector = "#PrevLink";

async function scrapeAll(browserInstance, URL, flCount)
{
	try
	{
		let browser = await browserInstance;

		const flListPage = await browser.newPage().then(console.log("Вкладака открыта..."));//Открываем новую вкладку
		await flListPage.goto(URL, { waitUntil: ['domcontentloaded'] }).then(() => console.log('Страница со списком фрилансеров и пагинацией открыта...'));//Страница со списком фрилансеров и пагинацией
		await sleep(getRandomArbitrarySec(4, 6));

		await scrapeWithCicle(flListPage, flCount, db_table, browser);//Парсим указанное количество фрилансеров
		await sleep(getRandomArbitrarySec(4, 6));//отдыхаем 4-6 секнд
		//browser.close();

		if (await flListPage.$(paginationNextPageSelector) !== null)
		{

			while ((await flListPage.$(paginationNextPageSelector) !== null))
			{
				console.log("next page...");
				await flListPage.goto(await flListPage.$eval(paginationNextPageSelector, (element) => element.href));
				await sleep(getRandomArbitrarySec(4, 6));

				await scrapeWithCicle(flListPage, flCount, db_table, browser);//Парсим указанное количество фрилансеров
				await sleep(getRandomArbitrarySec(4, 6));//отдыхаем 4-6 секнд
			};

		}

	}
	catch (err)
	{
		console.log("Что-то пошло не так =>\n", err);
	};
};

module.exports = (browserInstance, currentUrl, flCount) => scrapeAll(browserInstance, currentUrl, flCount);