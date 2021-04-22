[![Contentstack](/public/contentstack.png)](https://www.contentstack.com/)

## How to build Contentstack Youtube Extenion

Clone the repository in your local machine and use following command to build app

```
npm install
npm start
 or
 yarn
 yarn start
```
After building the app add ngrok to the root folder use following command to tunnel the localhost
```
ngrok http 3000
```
Now from the terminal copy url with https and paste it in external host section of Extension.
In config section add following config 

api_key- Your Youtube api key
channel_id- Id of the channel you want to select videos from
host_url- url same used in hosted link

## Prehosted link
[![Hosted Link](https://youtube-extension.vercel.app/)]