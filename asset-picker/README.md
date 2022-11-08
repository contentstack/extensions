

# Asset Picker

The Asset Picker component is a custom extension that allows you to select and upload asset(s) into entries from their stack.


## Installation
In the project directory, install dependencies using the following command:
### `npm install`
Then, run the following command to start the app on `http://localhost:3000`
### `npm start`



## Setup

To set up the Asset Picker component follow the steps below:

1. Go to Stack Settings > Extensions > Create New Extension.
2. Select **Custom Field** as Extension Type.
3. Provide a suitable title for example, Asset Picker.
4. Select **Asset** as the field data type.
5. Select **Multiple** to add/select multiple assets.
6. Select the hosting method.
7. Create a new content type.
8. Add a custom field and select the Asset Picker extension.
9. (optional) Under the Advanced tab, you can add configurations for your asset picker under the config parameter section.
**![](https://lh5.googleusercontent.com/LwMhS2lkrkIT0psHOZHl1L8m-9lZIf8aI4erpag8JvBf_kL0DqS7hZjgHTvULHFIytCo4XY6p7UNJndnUqzQpviU4-B32-ao2gdjUETAPkDJy1kdtTG9clLTN2ZJPxqyBowmaVnxkfrebNxpBhNLBqwg-jmEmfaIrYvUavTQGgybVUGh0HlbdVlIag)**
10. Save your content type. This new content type will include an Asset Picker custom field.


## Advanced Config
	
|**Property Name**  | **Type** |  **Description** | **Default**
|--|--|--|--|
| **only** | string | Allows user to select from specific asset type only `"image", "video","audio","document","code","executable","archive"` | - | |
| **multiple** | boolean or `{max:number}` | Define to allow single or multiple assets selection | false |
| **fileTypes** | string | Allow only user desired file types (identified by extension) to be selectable in asset picker `Accepts comma-separated file extensions like png,json` | - |
| **size** | `{min: number,max: number}` | Lets you define the minimum or/and maximum sized assets that can be selected | - |



