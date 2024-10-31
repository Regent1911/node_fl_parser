const flScraperController = require('./controllers/fl_pageController');

const browserObject = require('./browser');
const browserInstance = browserObject.startBrowser();
const parseCount = 2;

async function startParse(parseCount = 10)
{
	try
	{
		if (parseCount) await startParseFreelancers(parseCount);
	}
	catch (error) { console.error(error); }
};

async function startParseFreelancers(flCount)
{

	return new Promise(async (resolve, reject) =>
	{
		const resumeUrl = 'https://www.fl.ru/freelancers/';

		const parseCount = flCount;
		console.log("flCount", parseCount);

		await flScraperController(browserInstance, resumeUrl, parseCount).then(result =>
		{
			resolve(result);
			console.log(result);

		}).catch(error => { reject(new Error(error)) })

	})
};

startParse(parseCount).then(() => (process.exit(1)));