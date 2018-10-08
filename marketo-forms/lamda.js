const https = require("https");

const get = ({ hostname, path, headers }) =>
    new Promise((resolve, reject) => {
        https
            .request({ method: "GET", hostname, path, headers }, response => {
                let data = "";
                response.on("data", chunk => (data += chunk));
                response.on("end", () => resolve(JSON.parse(data)));
            })
            .on("error", error => reject(error))
            .end();
    });

const auth = () => get({
    hostname: `${process.env.MUNCHKIN_ID}.mktorest.com`,
    path: `/identity/oauth/token?grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`
});

const getForms = (bearer, queryStringParameters) => {
    let path = `/rest/asset/v1/forms.json`;
    if (queryStringParameters && queryStringParameters.folder) {
        path = `${path}?folder=${queryStringParameters.folder}`;
    }
    return get({
        hostname: `${process.env.MUNCHKIN_ID}.mktorest.com`,
        path: path,
        headers: {
            Authorization: `Bearer ${bearer}`
        }
    });
};

exports.handler = function(event, context, callback) {
    auth(event)
        .then(res => res.access_token)
        .then(bearer => getForms(bearer, event.queryStringParameters))
        .then(res =>
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(res.result)
            })
        )
        .catch(error => {
            console.log(error);
            callback(error);
        });
};