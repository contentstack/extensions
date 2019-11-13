# Brightcove – Contentstack Extension

#### About this extension
The Brightcove extension lets you fetch Brightcove videos and display them into a field in your Content Type. Subsequently, while creating entries, you can select one or more of the listed videos as input value for that field.


![Brightcove Plugin Screenshot](https://images.contentstack.io/v3/assets/bltf2fb14dd3176c6f6/bltb5335d8f8d4feb2a/5b62dde202a4ed4c3dc9f839/download)


#### How to use this extension
We have created a step-by-step guide on how to create a Brightcove extension for your content types. You can refer the [Brightcove extension guide](https://www.contentstack.com/docs/guide/extensions/brightcove-extension-setup-guide) on our documentation site for more info.


#### Required Config Parameters
You will need to add the following config parameters for the extension:

```
{
	"client_id": "YOUR_BRIGHTCOVE_CLIENT_ID",
	"client_secret": "YOUR_BRIGHTCOVE_CLIENT_SECRET",
	"oauthUrl": "YOUR_BRIGHTCOVE_AUTH_PROXY_URL",
	"brightcoveUrl": "https://cms.api.brightcove.com/v1/accounts/4709052668001/videos",
	"searchUrl": "https://cms.api.brightcove.com/v1/accounts/4709052668001/videos?q="
}
```

You'll need to set up a proxy for the [Brightcove oAuth API](https://support.brightcove.com/overview-oauth-api-v4) to get a token. You can find an [example here](https://github.com/BrightcoveLearning/sample-proxy-apps). Your proxy should return the token object, which can then be passed to the standard Brightcove API endpoints shown above.


#### Other Documentation
- [Extensions guide](https://www.contentstack.com/docs/guide/extensions)
- [Common questions about extensions](https://www.contentstack.com/docs/faqs#extensions)


#### Modifying Extension

To modify the extension, first clone this repo and install the dependencies. Then, edit the HTML, CSS and JS files from the source folder, and create a build using gulp task.

To install dependencies, run the following command in the root folder
```
npm install gulp-cli -g
npm install
```
To create new build for the extension, run the following command (index.html):

    gulp build

