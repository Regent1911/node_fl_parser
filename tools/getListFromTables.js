const queryDB = require('./queryDB');

async function getListFromTable(selectSection, whereSection)
{
	return new Promise((resolve, reject) =>
	{
		let currentQuery = `${selectSection} ${whereSection}`;

		queryDB(currentQuery, []).then(async result =>
		{
			console.info(`result of query : ${currentQuery}`);
			resolve(result);

		}).catch(err =>
		{
			reject(err);
			console.error(err); // обрабатываем ошибки;
			return;
		});
	})

}


module.exports = { getListFromTable };
