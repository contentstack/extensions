const { google } = require("googleapis");
const key = require("./service_account.json");
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, ["https://www.googleapis.com/auth/analytics.readonly"], null);

async function getData({ view_id, metrics, dimensions, start_date, end_date, filters, sort, max_results }) {
	const response = await jwt.authorize();
	return await google.analytics("v3").data.ga.get({
		"auth": jwt,
		"ids": "ga:" + view_id,
		"start-date": start_date,
		"end-date": end_date,
		"metrics": metrics,
		"dimensions": dimensions,
		"filters": filters,
		"sort": sort,
		"max-results": max_results || 1000
	});
}

exports.handler = async (event) => {
	if (!event.queryStringParameters) {
		return {
			statusCode: 422,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ "error": "Invalid request" })
		};
	}
	
	try{
		let result = await getData(event.queryStringParameters);
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(result.data)
		};
	}catch (e){
		return {
			statusCode: 400,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({"error": e.message})
		};
	}
};