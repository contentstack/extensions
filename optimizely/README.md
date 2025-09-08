#  Optimizely – Contentstack Extension

##  About this extension

The Optimizely extension lets you serve personalized content by allowing you to select the audience for each entry. This extension fetches and displays your Optimizely audiences into a field in your content type. Subsequently, while creating entries, content managers can select audience(s) for each entry. Based on the selection, the entry will be visible only to the targetted audience when published.  
![Optimizely Content Personalization Extension](https://images.contentstack.io/v3/assets/bltf2fb14dd3176c6f6/blt07a6552c48ce5011/5bd31c0b76ba81625f90ccf4/download)
##  How to use this extension

We have created a step-by-step guide on how to create an Optimizely extension for your content types. You can refer the [Optimizely extension guide](https://www.contentstack.com/docs/guide/extensions/custom-fields/optimizely-extension-setup-guide) on our documentation site for more info.

## 	Modifying this extension

To modify the extension, first clone this repo and install the dependencies. Then, edit the HTML, CSS and JS files from the source folder, and create a build using gulp task.

To install dependencies, run the following command in the root folder

    npm install gulp-cli -g
    npm install

To create new build for the extension, run the following command (index.html):

    gulp build

To run source watch, run the following command:
```
gulp watch
```

##  Other Documentation

- [Extensions guide](http://www.contentstack.com/docs/guide/extensions)
- [Common questions about extensions](https://www.contentstack.com/docs/faqs#extensions)

