const axios = require('axios');

const authBaseUrl = 'https://oauth.brightcove.com';
const cmsBaseUrl = 'https://cms.api.brightcove.com';
const { clientId, clientSecret } = process.env;
const authString = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

async function getData({ method, url, headers, data }) {
  const response = await axios({ method, url, headers, data });
  return response.data;
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { authUrl } = body;
    const authHeader = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const authResponse = await getData({
      method: 'POST',
      url: authBaseUrl + authUrl,
      headers: authHeader,
      data: authString,
    });

    const { videoUrl } = body;
    const videoHeader = {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${authResponse.access_token}`,
    };

    const getVideos = await getData({
      method: 'GET',
      url: cmsBaseUrl + videoUrl,
      headers: videoHeader,
    });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
      },
      body: JSON.stringify(getVideos),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
      },
      body: JSON.stringify({
        name: error.name,
        code: error.code,
        message: error.message,
      }),
    };
  }
};
