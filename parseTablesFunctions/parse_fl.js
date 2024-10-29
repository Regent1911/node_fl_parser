const internal = require('stream');
const queryDB = require('../tools/queryDB');

const fs = require('fs');

async function parseAndSaveToDB(scrapedData)
{
	let pickedData = scrapedData;

	let count = 0;

	let currentResumeId = Number;

	/*for (const [url_key, data] of Object.entries(pickedData))
	{
		try
		{
			fs.writeFileSync(`./parsed_data/resume/parsed_data_resume_${Date.now()}.json`, JSON.stringify(data), 'utf8', function (err) { if (err) { return console.log(err); } });
			count++
		} catch (err)
		{
			console.error("something wrong! : ", err);
		}

		let isDuplicate = Boolean;
		let selectQuery = `SELECT \`id_resume\` FROM  \`ps_parsjl_resume\` WHERE resume_url ='${url_key}'`;

		await queryDB(selectQuery)
			.then(result =>
			{
				console.log('/______________________selectQuery______________________/')
				console.log(selectQuery);
				console.log(result);
				console.log(result.length);
				if (result.length)
				{
					console.log(url_key, ": is duplicate resume"); isDuplicate = true;
				} else { isDuplicate = false; }

			});

		if (isDuplicate == true) { continue };

		let insertQuery = `INSERT INTO \`ps_parsjl_resume\` (resume_date, resume_number, resume_name, resume_phone,
				resume_email, resume_residence, resume_wage, resume_schedule, resume_education, resume_experience,
				resume_citizenship, resume_gender, resume_years_old, resume_additional_languages, resume_additional_driver_license,
				resume_additional_duty_journey, resume_additional_skills, resume_additional_about_me, resume_image, resume_parsed, resume_url, resume_portfolio)
			 VALUES(
			'${data["resumeDate"] ? data["resumeDate"] : ""}',
			'${data["resumeID"] ? data["resumeID"] : ""}',
			'${data["resumeName"] ? data["resumeName"] : ""}',
			'${data["resumePhone"] ? data["resumePhone"] : ""}',
			'${data["resumeEmail"] ? data["resumeEmail"] : ""}',

			'${data["dataFromResume"]["Общая_информация"]["Проживание"] ? data["dataFromResume"]["Общая_информация"]["Проживание"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Заработная плата"] ? data["dataFromResume"]["Общая_информация"]["Заработная плата"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["График работы"] ? data["dataFromResume"]["Общая_информация"]["График работы"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Образование"] ? data["dataFromResume"]["Общая_информация"]["Образование"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Опыт работы"] ? data["dataFromResume"]["Общая_информация"]["Опыт работы"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Гражданство"] ? data["dataFromResume"]["Общая_информация"]["Гражданство"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Пол"] ? data["dataFromResume"]["Общая_информация"]["Пол"] : ""}',
			'${data["dataFromResume"]["Общая_информация"]["Возраст"] ? data["dataFromResume"]["Общая_информация"]["Возраст"] : "s"}',

			'${data["dataFromResume"]["Дополнительная_информация"]["Иностранные языки"] ? data["dataFromResume"]["Дополнительная_информация"]["Иностранные языки"] : ""}',
			'${data["dataFromResume"]["Дополнительная_информация"]['Водительские права'] ? data["dataFromResume"]["Дополнительная_информация"]['Водительские права'] : ""}',
			'${data["dataFromResume"]["Дополнительная_информация"]['Командировки'] ? data["dataFromResume"]["Дополнительная_информация"]['Командировки'] : ""}',
			'${data["dataFromResume"]["Дополнительная_информация"]['Навыки и умения'] ? data["dataFromResume"]["Дополнительная_информация"]['Навыки и умения'] : ""}',
			'${data["dataFromResume"]["Дополнительная_информация"]['Обо мне'] ? data["dataFromResume"]["Дополнительная_информация"]['Обо мне'] : ""}',
			'${data["resumeImage"] ? data["resumeImage"] : ""}',
			'0',
			'${url_key}',
			'${data["dataFromResume"]["Дополнительная_информация"]['Портфолио'] ? data["dataFromResume"]["Дополнительная_информация"]['Портфолио'] : ""}')`
		insertQuery = insertQuery.replaceAll(/[\t\n]/g, '');

		await queryDB(insertQuery).then(result =>
		{
			currentResumeId = result.insertId;
		}).catch(err => { console.error(err) });

		if (data["dataFromResume"]["Опыт_работы"])
		{
			if (currentResumeId == 0) { console.error("currentResumeId == 0"); return };

			for (const [expkey, exp_value] of Object.entries(data["dataFromResume"]["Опыт_работы"]))
			{
				let insertExpirienceQuery = `INSERT INTO \`ps_parsjl_resume_experience\` ( id_resume, exp_work_period, exp_function, exp_company, exp_responsibility)
				VALUES('${currentResumeId}','${exp_value["Период работы"]}','${exp_value["Должность"]}','${exp_value["Компания"]}','${exp_value["Обязанности"]}')`;

				await queryDB(insertExpirienceQuery).then(result =>
				{

				}).catch(err => { console.error(err) });
			}
		}
		if (data["dataFromResume"]["Образование"])
		{
			for (const [educkey, educ_value] of Object.entries(data["dataFromResume"]["Образование"]))
			{
				if (currentResumeId == 0) { console.error("currentResumeId == 0"); return };

				let insertEducationQuery = `INSERT INTO \`ps_parsjl_resume_education\` ( id_resume, education_level, education_ending, education_institution, education_specialty)
				VALUES('${currentResumeId}','${educ_value["Образование"]}','${educ_value["Окончание"]}','${educ_value["Учебное заведение"]}','${educ_value["Специальность"]}')`;

				await queryDB(insertEducationQuery).then(result =>
				{

				}).catch(err => { console.error(err) });
			}
		}
	};*/

	if (pickedData !== undefined)
	{
		//console.info(pickedData)
	}

}

module.exports = { parseAndSaveToDB }