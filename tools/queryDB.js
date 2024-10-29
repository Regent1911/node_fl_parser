const mysql = require('mysql2');
const config = require('../settings/_db_settings');//

function queryDB(query, params = {})
{
	return new Promise((resolve, reject) =>
	{
		const connection = mysql.createConnection(config);

		connection.connect(err =>
		{
			if (err)
			{
				reject(err); connection.end();
				return;
			}

			const sql = query;
			const values = params;

			connection.query(sql, values, (err, results) =>
			{
				if (err)
				{
					reject(err); connection.end();
					return;
				}

				resolve(results); connection.end();
			});
		});
	});
}

module.exports = queryDB;