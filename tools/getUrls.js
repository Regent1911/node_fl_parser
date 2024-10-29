const queryDB = require('./queryDB');

function getUrls(id_pars_site)
{
	let currentQuery = '';

	if (id_pars_site == 0)
	{
		currentQuery = 'select * from ps_pars_site where is_ready = 1';
	} else
	{
		currentQuery = 'select * from ps_pars_site where id_pars_site = ' + id_pars_site;
	}
	return queryDB(currentQuery, []).then(async result =>
	{
		console.info(`result of query : ${currentQuery}`);
		resolve(result);

	}).catch(err =>
	{
		reject(err);
		console.error(err); // обрабатываем ошибки;
		return;
	});
}
