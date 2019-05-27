# External API Lookup Template – Contentstack Field Extension

## About this Extension
The External API Lookup extension lets you fetch data from an external API and display the data as possible values for the field on an entry page in Contentstack.

**Note**: For this example, we have used [Reqres](https://reqres.in/) that provides demo data.
![External API Lookup extension demo](https://images.contentstack.io/v3/assets/bltf2fb14dd3176c6f6/bltc584b4bbcbc5949e/5ce7fc9a5210e25f19626286/download)

## How to use this extension

We have created a step-by-step guide on how to create an External API Lookup extension for your content types. You can refer the [External API Lookup extension guide](https://www.contentstack.com/docs/guide/extensions/external-api-lookup-extension-setup-guide) on our documentation site for more info.

## Modifying Extension
To modify the extension, you first need to clone this repo and install the dependencies. Then, edit the HTML, CSS, and JS files from the source folder, and create a build using gulp task.

To install dependencies, run the following command in the root folder:
```
npm install gulp-cli -g
npm install
```
To create a new build for the extension, run the following command (index.html):
```
gulp
```
To run source watch, run the following command:
```
gulp watch
```

#### Other Documentation
- [Extensions guide](https://www.contentstack.com/docs/guide/extensions)
- [Common questions about Extensions](https://www.contentstack.com/docs/faqs#extensions)