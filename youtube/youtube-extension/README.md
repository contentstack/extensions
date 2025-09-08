[![Contentstack](/youtube/youtube-extension/public/contentstack.png)](https://www.contentstack.com/)

## Steps required to create new build

First the app in vscode or any editor if your preference.
Then fire up the terminal in root directory of the project and used following command

```
npm install
npm run build
or
yarn 
yarn build
```
After creating the build open up the stack where we are using this app.
Goto to the setting and select extensions.
Now on the top right conner. Click on `add extensions` option.
Select create new and from modal select custom fields.
In the title add any name you like in our case it is youtube-extension.
In Field data section select JSON as option.
Then mark `checked` for Multiple option.

In hosting method select host with contentstack. Then new editor would popup. Here paste the code from index.html from `build folder` form this app.
Now inside the config parameters fields add following code

```json
{
    "apiKey":"your_youtube_apikey",
    "channelId":"your_channel_id",
    "redirectUrl":"popup_file_link_from_stack_assets",
    "saveFullResponse":"boolean value"
}

```