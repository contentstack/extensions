# Marketo Forms – Contentstack Extension Readme

####  About this extension

The Marketo Forms extension lets you fetch and display the list of your existing Marketo forms into the field of your content type. When creating entries, the content managers can view the list of forms and select the one that they want to use on the web page.

  
![marketo-forms-extension](https://images.contentstack.io/v3/assets/bltf2fb14dd3176c6f6/blt8fc7a54a076090be/5bbb2549834545315961c5d7/download)


#### How to create this extension

We have created a step-by-step guide on how to create a Marketo Forms extension for your content types. You can refer the [Marketo Forms extension guide](https://www.contentstack.com/docs/guide/extensions/custom-fields/marketo-forms-extension-setup-guide) on our documentation site for more info.

  

####  Other Documentation

- [Extensions guide](http://www.contentstack.com/docs/guide/extensions)
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