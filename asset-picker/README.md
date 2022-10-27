

# Asset Picker

This is an example react app showcasing **Asset Picker** from venus component (using contenstack SDK).

The Asset Picker provides two ways to pick asset(s):
1. Choose Asset
2. Upload Asset 

## Run
In the project directory, install dependencies:
### `npm install`
Then, run the following command to run the app on `http://localhost:3000`
### `npm start`



## Setup

 1. Create Extension of type **Custom Field**:
	 a. Go to a *Stack Settings* > *Extensions* > *Create New Extension*.
	 b. Select **Custom Field** as Extension Type.
	 c. Give a suitable title.
	 d. Select **Asset** in Field Data Type.
	 e. Check **Multiple** if multiple assets are to be stored.
	 f. Setup hosting method based on where this app is running, i.e. for development, set **External hosting URL** to `http://localhost:3000`

2. Add a **Custom Field** to desired content type:
	a. Go to *Content Models* > Select existing Content Type or create new Content Type.
	b. Add new field of type Custom Field.
	c. Give a display name
	d. Select the extension created from **Step 1**.
	e. (optional) Advanced config can be passed to asset picker from the config parameter section. See the below table for reference
	
|**Property Name**  | **Type** |  **Description** | **Default**
|--|--|--|--|
| **only** | string | Allows user to select from specific asset type only `"image", "video","audio","document","code","executable","archive"` | - | |
| **multiple** | boolean or `{max:number}` | Define to allow single or multiple assets selection | false |
| **fileTypes** | string | Allow only user desired file types (identified by extension) to be selectable in asset picker `Accepts comma-separated file extensions like png,json` | - |
| **size** | `{min: number,max: number}` | Lets you define the minimum or/and maximum sized assets that can be selected | - |

**You can add above config to the content type like this:**

**![](https://lh5.googleusercontent.com/LwMhS2lkrkIT0psHOZHl1L8m-9lZIf8aI4erpag8JvBf_kL0DqS7hZjgHTvULHFIytCo4XY6p7UNJndnUqzQpviU4-B32-ao2gdjUETAPkDJy1kdtTG9clLTN2ZJPxqyBowmaVnxkfrebNxpBhNLBqwg-jmEmfaIrYvUavTQGgybVUGh0HlbdVlIag)**

Now you can see the Asset Picker inside any entry of the content type used in **Step 2**. 



