
#  IBM Watson Extension

##  About this extension

The IBM Watson extension widget lets you analyze the content of an entry and extract meta-data from the content such as categories, concepts, emotions, entities, keywords, relations, semantic roles, and sentiment. This widget uses custom annotation models developed by Watson Knowledge Studio to analyze the data and identify industry- or domain-specific entities and relations in unstructured text.

![ibm watson widget image](https://images.contentstack.io/v3/assets/bltf2fb14dd3176c6f6/blt5c7a7989419f7069/5beec5567971bb6f0bd754ed/download)

##  How to create this extension

We have created a step-by-step guide on how to create the IBM Watson widget extension for your content types. You can refer the [IBM Watson AI widget extension guide](https://www.google.com/url?q=https://www.contentstack.com/docs/guide/extensions/custom-widgets/ibm-watson-extension-setup-guide&sa=D&ust=1542375266182000&usg=AFQjCNHHv6tZHp7zgjXAWJonJPjdNN0OEA) on our documentation site for more info
## Modifying this extension

To modify the extension, first, clone this repo and install the dependencies. Then, edit the HTML, CSS and JS files from the source folder, and create a build using gulp task.

To install dependencies, run the following command in the root folder

    npm install gulp-cli -g
    npm install

To create new build for the extension, run the following command (index.html):

    gulp build

##  Other Documentation

- [Extensions guide](http://www.contentstack.com/docs/guide/extensions)

- [Common questions about extensions](https://www.contentstack.com/docs/faqs#extensions)
