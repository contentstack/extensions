# Contentstack Extensions 

Contentstack provides Extensions that let you extend its UI. It provides two types of extensions: Custom Fields and Custom Widgets.

The **Custom Fields** extension lets you create custom fields that you can use in your content types, such as a color picker, code editor, video selector, and more. The **Custom Widgets** extension lets you add widgets that help you analyze the content of an entry and recommend content ideas. Examples of custom widgets are SEO recommendations, sentiment analysis, and content translation in different languages.

This is a repository of example extensions created using Contentstack’s [Extensions SDK](https://github.com/contentstack/ui-extensions-sdk).

### Examples of custom fields created using Extensions
Here are some examples/use cases of custom fields that can be created using Extensions. These examples come with readme files that explain how to install and get started with these fields.   

[Color Picker](./color-picker):  
A native color picker polyfill that allows users to select color as input value and saves the color code in the backend.


[Ace Editor](./ace-editor):  
A code editor written in JavaScript, allowing you to edit HTML, PHP, JavaScript and other with ease.

[JSON Editor](./json-editor):  
A simple editor that lets you view, edit and format JSON code within the field of your content type

[Key-value Field](./key-value-field):  
This extension lets you add key-value pairs as input value of a field of your content type.   

[Progress Bar](./progress-bar):  
It lets you display a progress bar as input field. Users can set value by sliding the progress bar to the left or right.

[Star Ratings](./ratings):   
This extension lets you display five stars as an input field. Users can select one or more stars, and a corresponding value will be saved in Contentstack.  

[Brightcove](./brightcove):  
This extension lets you fetch and display your Brightcove videos into a field of your content type.

[Shopify](./shopify):  
This extension lets you load products of your Shopify store into the field of your content type.

[Egnyte](./Egnyte):  
This extension lets you fetch files of your Egnyte account and display them into a field of your content type.

[Ooyala](./ooyala):  
This extension lets you fetch and display your Ooyala videos into a field of your content type.

[Text Intelligence](./text-intelligence): 
This extension (custom widget) uses MonekyLearn APIs to provide helpful recommendations such as content summarizer, keyword extractor, retail classifier, etc.

#### Other Documentation
- [What are Extensions](https://www.contentstack.com/docs/guide/extensions)
- [Extensions SDK](https://github.com/contentstack/ui-extensions-sdk)
-  [Extensions FAQs](https://www.contentstack.com/docs/faqs#extensions)