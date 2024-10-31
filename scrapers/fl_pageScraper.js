//const { error } = require('console');
//const fs = require('fs');
const sleep = ms => new Promise(res => setTimeout(res, ms));
const getRandomArbitrarySec = require('../tools/getRandomArbitrarySec');

const scraperObject = {

	async scraper(browser, _url)
	{
		let currentUrl = _url;

		const freelancerPage = await browser.newPage();//Страница с резюме
		let currentPageStatus;//Статус запроса к текущей странице

		await freelancerPage.setRequestInterception(true);
		await freelancerPage.on('request', (req) =>
		{
			if (req.resourceType() === 'image')//если image но не капча
			{
				req.abort();
			}
			else
			{
				req.continue();
			}
		});

		console.log(`\nПереход по "${_url}"...\n`);
		// переходим к выбранной категории
		if (currentUrl !== undefined)
		{
			await freelancerPage.goto(currentUrl, {
				timeout: 35000,
				waitUntil: 'domcontentloaded'//or 'load'
			});
		};

		async function scrapeCurrentPage(_url)
		{
			const showContactsButtonSelector = '#showContactsBtn_header';

			const currentFreelancer = {}

			if (await freelancerPage.$(showContactsButtonSelector) !== null)//если на странице есть элемент возвращающий по клику телефон
			{
				await freelancerPage.click(showContactsButtonSelector).then(result => console.log(result)).then(async res =>
				{
					await sleep(getRandomArbitrarySec(4, 7)).then((res) => { console.info(`Выждали паузу(fl_pageScraper)`) });

					currentFreelancer.userName = await freelancerPage.evaluate(() =>
					{
						if (document.querySelector('h1.as-span') !== undefined)
							return document.querySelector('h1.as-span').textContent.trim();
					});

					currentFreelancer.contact_websites = await freelancerPage.evaluate(() =>
					{
						if (document.querySelectorAll('i.b-icon2__network').length !== 0)
						{
							let websites = []
							document.querySelectorAll('i.b-icon2__network').forEach(el =>
							{
								websites.push(el.parentElement.textContent.trim());
							})

							return websites;
						}
					});

					currentFreelancer.contact_email = await freelancerPage.evaluate(() =>
					{
						if (document.querySelector('i.b-icon2__email') !== null)
							return document.querySelector('i.b-icon2__email').parentElement.textContent.trim()
					});
					currentFreelancer.contact_phone = await freelancerPage.evaluate(() =>
					{
						if (document.querySelector('i.b-icon2__phone') !== null)
							return document.querySelector('i.b-icon2__phone').parentElement.textContent.trim()
					});
					currentFreelancer.contact_telegram = await freelancerPage.evaluate(() =>
					{
						if (document.querySelector('i.b-icon2__telegram') !== null)
							return document.querySelector('i.b-icon2__telegram').parentElement.textContent.trim()
					});
					currentFreelancer.user_location = await freelancerPage.evaluate(() =>
					{
						if (document.querySelector('i.b-icon2__location') !== null)
							return document.querySelector('i.b-icon2__location').parentElement.textContent.trim()
					});
					currentFreelancer.userLink = await freelancerPage.evaluate(() =>
					{
						return document.location.href
					});

				}).catch((error) => { if (error) console.error(error) });
			}
			await freelancerPage.close();

			return currentFreelancer;
		}

		let dataFromPage = await scrapeCurrentPage();
		dataFromPage['pageState'] = currentPageStatus;
		console.log(dataFromPage);

		return dataFromPage;
	}
}

module.exports = scraperObject;