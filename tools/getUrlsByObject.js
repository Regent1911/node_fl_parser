const queryDB = require('./queryDB');

function getUrlsByObject(id_pars_object)
{
	let currentQuery = '';

	currentQuery = 'select ps.reg_code, po.url, pc.id_pars_category' +
		'from ps_pars_object po' +
		'left join ps_pars_category pc on pc.id_pars_category = po.id_pars_category' +
		'left join ps_pars_site ps on ps.id_pars_site = pc.id_pars_site' +
		'where id_pars_object = ' + id_pars_object;

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

module.exports = getUrlsByObject;