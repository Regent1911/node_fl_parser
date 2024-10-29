const queryDB = require('./queryDB');

function getUrlsByCateg(id_pars_category)
{
	let currentQuery = '';

	currentQuery = 'select ps.reg_code, pc.url' +
		'from ps_pars_category pc' +
		'left join  ps_pars_site ps on ps.id_pars_site = pc.id_pars_site' +
		'where id_pars_category = ' + id_pars_category;

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

module.exports = getUrlsByCateg;