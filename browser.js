/*const puppeteerChrome = require(`puppeteer`);*/

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteerChrome = require('puppeteer-extra');

/*const pptrFirefox = require('puppeteer-firefox');*/
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerChrome.use(StealthPlugin());

async function startBrowser()
{
	let browser;

	try
	{
		const message = `\n\tOpening the browser...\n`;
		const colour = '\x1b[36m%s\x1b[0m';
		console.info(colour, message);
		console.info(colour, process.env.LOCALAPPDATA + "\\Google\\Chrome Dev\\User Data\\")
		browser = await puppeteerChrome.launch({
			executablePath: 'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe',
			userDataDir: process.env.LOCALAPPDATA + "\\Google\\Chrome Dev\\User Data\\",
			headless: "new",//false or true or 'new'
			/*devtools: true,*/
			'ignoreHTTPSErrors': true,
			args: ['--no-sandbox', '--profile-directory=Profile 1'],
			//args: [`--window-size=1920,1080--user-data-dir=C:\\Users\\DeusExMachine\\AppData\\Local\\Google\\Chrome Dev\\User Data\\Default`],
		});


	} catch (err)
	{
		console.log("Could not create a browser instance => : ", err);
	}

	return browser;
}

module.exports = { startBrowser };