const internal = require('stream');
const queryDB = require('../tools/queryDB');

const fs = require('fs');

async function parseAndSaveToDB(scrapedData)
{
	let pickedData = scrapedData;
	let count = 0;
	let currentResumeId = Number;

	for (const [url_key, data] of Object.entries(pickedData))
	{
		try
		{
			fs.writeFileSync(`./parsed_data/freelancers/parsed_data_freelsncer_${Date.now()}.json`, JSON.stringify(data), 'utf8', function (err) { if (err) { return console.log(err); } });
			count++
		} catch (err)
		{
			console.error("something wrong! : ", err);
		}

		let isDuplicate = Boolean;
		let selectQuery = `SELECT \`id_user\` FROM  \`ps_fl_freelancers\` WHERE userLink ='${url_key}'`;

		await queryDB(selectQuery)
			.then(result =>
			{
				if (result.length)
				{
					console.log(url_key, ": is duplicate freelancer"); isDuplicate = true;
				} else { isDuplicate = false; }
			});

		if (isDuplicate == true) { continue };

		let insertQuery = `INSERT INTO \`ps_fl_freelancers\`
		(userName, contact_websites, contact_email, contact_vk, contact_phone, contact_telegram, user_location, userLink)
			 VALUES(
			'${data["userName"] ? data["userName"] : ""}',
			'${data["contact_websites"] ? data["contact_websites"] : ""}',
			'${data["contact_email"] ? data["contact_email"] : ""}',
			'${data["contact_vk"] ? data["contact_vk"] : ""}',
			'${data["contact_phone"] ? data["contact_phone"] : ""}',
			'${data["contact_telegram"] ? data["contact_telegram"] : ""}',
			'${data["user_location"] ? data["user_location"] : ""}',
			'${data["userLink"] ? data["userLink"] : ""}')`;

		insertQuery = insertQuery.replaceAll(/[\t]{2,}/g, '');
		await queryDB(insertQuery).then(result =>
		{
			currentResumeId = result.insertId;
		}).catch(err => { console.error(err) });

	};

	if (pickedData !== undefined)
	{
		//console.info(pickedData)
	}

}

module.exports = { parseAndSaveToDB }