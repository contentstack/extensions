

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

[Marketo Forms](./marketo-forms):  
This extension lets you fetch and display the list of your existing Marketo forms into the field of your content type.

[Brightcove](./brightcove):  
This extension lets you fetch and display your Brightcove videos into a field of your content type.

[Shopify](./shopify):  
This extension lets you load products of your Shopify store into the field of your content type.

[Egnyte](./egnyte):  
This extension lets you fetch files of your Egnyte account and display them into a field of your content type.

[Ooyala](./ooyala):  
This extension lets you fetch and display your Ooyala videos into a field of your content type.

[Optimizely](./optimizely):  
This extension lets you serve personalized content by allowing you to select the audience for each entry.

[Youtube](./youtube):
This extension lets you fetch and display Youtube videos into a field of your content type.

[External API Lookup](./external-api-lookup-template):
This extension lets you fetch data from an external API and display the data as possible values for the field on an entry page in Contentstack.

###  Examples of custom widgets created using Extensions
Here are some examples/use cases of custom widgets that can be created using Extensions. These examples come with readme files that explain how to install and get started with these widgets.

[Text Intelligence](./text-intelligence): 
This extension (custom widget) uses MonekyLearn APIs to provide helpful recommendations such as content summarizer, keyword extractor, retail classifier, etc.

[Google Analytics](./google-analytics): 
This widget uses the Google Analytics data to display the traffic analysis and statistics of your entry on the sidebar of the entry.

[IBM Watson](./ibm-watson):
The IBM Watson widget lets you analyze the content of an entry and extract meta-data from the content such as categories, concepts, emotions, entities, keywords, relations, semantic roles, and sentiment.

[Optimizely Experiments](./optimizely-experiments):
This extension lets you retrieve and display Optimizely Experiments and their details in your entry.

### Other Documentation
- [What are Extensions](https://www.contentstack.com/docs/guide/extensions)
- [Extensions SDK](https://github.com/contentstack/ui-extensions-sdk)
-  [Extensions FAQs](https://www.contentstack.com/docs/faqs#extensions)