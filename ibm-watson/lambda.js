const https = require("https");
const url = require('url');
const { host, pathname } = url.parse(process.env.WATSON_SERVICE_URL);

const post = ({ hostname, path, headers, body }) =>
    new Promise((resolve, reject) => {
        let postRequest = https
            .request({ method: "POST", hostname, path, headers }, response => {
                let data = "";
                response.on("data", chunk => (data += chunk));
                response.on("end", () => {
                  response.body = data;
                  resolve(response);
                });
            });
        postRequest.write(body);
        postRequest.on("error", error => reject(error));
        postRequest.end();
    });

const runAnalysis = ({ body }) => {
    return post({
        hostname: host,
        path: `${pathname}/v1/analyze?version=2018-03-19`,
        headers: {
            "Content-Type": 'application/json',
            'Authorization': 'Basic ' + new Buffer( 'apikey:' + process.env.WATSON_SERVICE_API_KEY).toString('base64')
        },
        body: body
    });
};

exports.handler = function(event, context, callback) {
    runAnalysis(event)
        .then(({statusCode, body}) =>{
           callback(null, {
                statusCode: statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: body
            });
        })
        .catch(error => {
            console.log(error);
            callback(error);
        });
};