#  Youtube – Contentstack Extension

## About this extension

The Youtube extension lets you fetch Youtube videos and display them into a field in your content type. Subsequently, while creating entries, content managers can select only one of the listed videos at a time as the input value for that field, and the details of the video will be saved as JSON in Contentstack. 

![contentstack Youtube image extension](/youtube/youtube-extension/public/youtube.png)

## How to use this extension

We have created a step-by-step guide on how to create a Youtube extension for your content types. You can refer the [Youtube extension guide](https://www.contentstack.com/docs/developers/create-custom-fields/youtube/) on our documentation site for more info.

## Modifying this extension

To modify the extension, first clone this repo and install the dependencies. Then, edit the index js or popup js, CSS files from the source folder, and create a build using gulp task.

To install dependencies, run the following command in the root folder for each app

    npm install
    
To create new build for the extension, run the following command :

    npm run build

## Other Documentation

-   [Extensions guide](https://www.contentstack.com/docs/guide/extensions)
    
-   [Common questions about extensions](https://www.contentstack.com/docs/faqs#extensions)
