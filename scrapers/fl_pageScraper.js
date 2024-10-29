//const { error } = require('console');
//const fs = require('fs');
const sleep = ms => new Promise(res => setTimeout(res, ms));

const scraperObject = {

	async scraper(browser, _url)
	{
		let currentUrl = _url;

		const resumePage = await browser.newPage();//Страница с резюме
		//await resumePage.setRequestInterception(true);
		/*await resumePage.setViewport({ width: 1280, height: 720 });*/
		let currentPageStatus;//Статус запроса к текущей странице

		const customUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0";

		// Set custom user agent
		await resumePage.setUserAgent(customUA).then(() => { console.log("Сменили UserAgent на : " + customUA) });
		// To save cookies
		//const cookies = await resumePage.cookies();
		// Save cookies to a file or database

		// To set cookies in a new session
		//await resumePage.setCookie(...cookies);
		//Вешаем обработчик событий, ловим статус `500`
		resumePage.on('response', (response) =>
		{
			if ((currentUrl == response.url()))
			{
				console.info(`URL текущий		:	${currentUrl}`)
				console.info(`URL в запросе		:	${response.url()}`);
				console.info(`Статус запроса	:	${response.status()}`);
				currentPageStatus = response.status();
			}
		});

		//функция принимает мин и макс значение секунд, возвращаем миллисекунды
		function getRandomArbitrarySec(min, max)
		{
			return Math.round(Math.random() * (max - min) + min) * 1000;
		};

		console.log(`\nПереход по "${_url}"...\n`);
		// переходим к выбранной категории
		if (currentUrl !== undefined)
		{
			await resumePage.goto(currentUrl, {
				timeout: 15000,
				waitUntil: 'domcontentloaded'//or 'load'
			});
		};
		//Ждём на всякий случай после загрузки страницы//
		if (currentPageStatus !== 500)
		{
			await sleep(getRandomArbitrarySec(4, 7)).then((result) => { console.info(`Выждали паузу(resume_pageScraper)`) });

		} else if (currentPageStatus == 500)
		{
			return { pageState: currentPageStatus }
		} else if (currentPageStatus == 302)
		{
			await resumePage.screenshot({ path: `screenshot_captcha_alt_${new Date().toLocaleTimeString().replace(/\:/gmi, "_")}.png` });
		}
		console.log(`\nПереход по "${_url}"...\n`);
		/////////////////////////////////////////////////
		//Функция сбора данных со станицы с прокликиванием кнопки "Показать ещё"//

		const isCaptchaPresent = await resumePage.evaluate(() =>
		{
			return document.querySelector('form[name="check_user"]') !== null;
		});
		if (isCaptchaPresent)
		{
			console.log("CAPTCHA!!!")
			await resumePage.screenshot({ path: `screenshot_captcha_${new Date().toLocaleTimeString().replace(/\:/gmi, "_")}.png` });
			await delay(15000);
		}

		async function scrapeCurrentPage(_url)
		{
			const resume_url = await resumePage.evaluate(() => document.URL);
			const headingText = await resumePage.evaluate(() => { if (document.querySelector('h1')) return document.querySelector('h1').textContent });
			const resumeID = await resumePage.evaluate(() => document.querySelector('h1~p.small').textContent.match(/\s(\d{5,7})\s/)[1]);
			const resumeDate = await resumePage.evaluate(() => document.querySelector('h1~p.small').textContent.match(/\s(\d{5,7})\s{3}·\s{3}(\d{1,2}\s\W{3,10}\d{4}\,\s\d{1,2}\:\d{1,2})/)[2]);
			const resumeName = await resumePage.evaluate(() => document.querySelector('.table-to-div>tbody:nth-child(1)>tr:nth-child(1)>td:nth-child(2)>p:nth-child(1)>b:nth-child(1)').innerText);
			const resumeImage = await resumePage.evaluate(() =>
			{
				if (document.querySelector(".resume_img") !== null)
				{
					return "https://joblab.ru" + document.querySelector(".resume_img").style["background-image"].replace(/url\(\"/gmi, '').replace(/\"\)/, '');
				} else { return ""; }
			});

			let resumeEmail = "";
			let resumePhone = "";

			if (await resumePage.$('[onclick^="cp()"]') !== null)//если на странице есть элемент возвращающий по клику телефон
			{
				await resumePage.click('[onclick^="cp()"]').then(result => console.log(result)).then(async res =>
				{
					await sleep(getRandomArbitrarySec(4, 7)).then((result) => { console.info(`Выждали паузу(resume_pageScraper)`) });
					resumePhone = await resumePage.evaluate(() => { if (document.querySelector('#p>a') !== undefined) return document.querySelector('#p>a').textContent.replaceAll(/\s/g, "") });

				}).catch((error) => { if (error) console.error(error) });
			}
			if (await resumePage.$('[onclick^="cm()"]') !== null)//если на странице есть элемент возвращающий по клику электронную почту
			{
				await resumePage.click('[onclick^="cm()"]').then(result => console.log(result)).then(async res =>
				{
					await sleep(getRandomArbitrarySec(4, 7)).then((result) => { console.info(`Выждали паузу(resume_pageScraper)`) });
					resumeEmail = await resumePage.evaluate(() => { if (document.querySelector('#m>a') !== undefined) return document.querySelector('#m>a').textContent });
				}).catch((error) => { if (error) console.error(error) });
			}

			const dataFromResume = await resumePage.evaluate(() =>
			{
				const tableRowsSelector = 'table.table-to-div > tbody > tr';

				const resumeData = {
					"Общая_информация": {},
					"Опыт_работы": {},
					"Образование": {},
					"Дополнительная_информация": {}
				}

				let currentCategoryName = "";//будет меняться при переборе элементов таблицы
				let currentKey = "";//temp key
				let currentVal = "";//temp val
				let expIndex = 0;
				let eductnIndex = 0;

				Array.from(document.querySelectorAll(tableRowsSelector)).map((tr) =>
				{
					if (tr.childNodes.length == 1)//Значит похоже заголовок
					{
						if (tr.childNodes[0].textContent !== "" && tr.childNodes[0].textContent.length > 2)//Значит заголовок
						{
							currentCategoryName = tr.childNodes[0].textContent;
							console.log("current category :", tr.childNodes[0].textContent);
							console.log("current length :", tr.childNodes[0].textContent.length);
						}
					}

					if (tr.childNodes.length == 2 && (tr.childNodes[0].textContent.length > 1 && tr.childNodes[0].textContent.length > 1))//значит похоже на ключ и значение
					{
						currentKey = tr.childNodes[0].textContent;
						currentVal = tr.childNodes[1].textContent;
					}

					if (currentCategoryName == "Общая информация" && tr.childNodes.length == 2)
					{
						resumeData["Общая_информация"][currentKey] = currentVal
					}
					if (currentCategoryName == "Опыт работы" && tr.childNodes.length == 2)
					{
						if (resumeData["Опыт_работы"][expIndex] == undefined)
						{
							resumeData["Опыт_работы"][expIndex] = {};
						}

						resumeData["Опыт_работы"][expIndex][currentKey] = currentVal;

						if (currentKey == "Обязанности")
						{
							expIndex++
						}

					}
					if (currentCategoryName == "Образование" && tr.childNodes.length == 2)
					{
						if (resumeData["Образование"][eductnIndex] == undefined)
						{
							resumeData["Образование"][eductnIndex] = {};
						}

						resumeData["Образование"][eductnIndex][currentKey] = currentVal;

						if (currentKey == "Специальность")
						{
							eductnIndex++
						}
					}

					if (currentCategoryName == "Дополнительная информация" && tr.childNodes.length == 2)
					{
						if (currentKey == "Портфолио")
						{
							let portfolioArr = [];

							currentVal = tr.childNodes[1].querySelectorAll('a').forEach(el =>
							{
								portfolioArr.push(el.href)
							})

							resumeData["Дополнительная_информация"][currentKey] = portfolioArr;
						} else
						{
							resumeData["Дополнительная_информация"][currentKey] = currentVal
						}

					}

				});

				return resumeData;
			});


			await resumePage.close();

			return {
				resume_url: resume_url,
				headingText: headingText,
				resumeID: resumeID,
				resumeDate: resumeDate,
				resumeName: resumeName,
				resumeImage: resumeImage,
				resumePhone: resumePhone,
				resumeEmail: resumeEmail,
				dataFromResume
			};
		}

		let data = await scrapeCurrentPage();

		console.log('////////////resume_pageScarper^////////////');
		//console.log(data);
		console.log('////////////resume_pageScarper$////////////');


		data['pageState'] = currentPageStatus;

		return data;
	}
}

module.exports = scraperObject;