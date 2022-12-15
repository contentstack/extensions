

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
| **only** | string | Select from specific asset type `"image", "video","audio","document","code","executable","archive"` | - | |
| **multiple** | boolean or `{max:number}` | Select single or multiple asset | false |
| **fileTypes** | string | Select specific file types (identified by extension) | - |
| **size** | `{min: number,max: number}` | Add minimum or/and maximum asset size | - |


## Screenshots

![](https://lh6.googleusercontent.com/vKaflzttYG98dLCIUFc0T1BH5IF6aGd7duC989umzlL18l5mjdAwV1jwAtVWCthsrglmcgc8IF7qdcJ2p1OJTl5aJ73u-NgpRhN5kZn98Aah0d4k-gLw00kO4CpyS2IPRVAPnSLx9xz_hwcKgqdtdf1DaCh9iflk77oLT1wKmnNTHccXvI-lEnZZqa7tYA)

#### Choose asset modal:

![](https://lh6.googleusercontent.com/BtnCCk9KwOPAVzlYBH9Vnaz7MJspoZmSunRP04uan-U7mgBlqoULO5mS1g8RETA3E2cvU1EvgcWgjFW47V1KkLjEdVB2NRVnMENuxdH7Mc7X-0e-wn8JluAPNCQH7t0DOo6ry9Y-qmoc_jc54EIs-9GaN7Rcr8wdMj-upSqG578Z8NjTAkq8Oxv0FYEokA)

#### Upload asset modal:

![](https://lh4.googleusercontent.com/8SaY82OWfc1K1pAnilz0SVly-lm8N8ecGej9VlbCKum2u5GC9RgW7bzEY1LEgFKUiS-SqfxQLs0ynHH0A_-RhGRt_OnJcPZjGvMQd64HAGpqv2Gj_Plk-_ylhCKZ-GG2pHbOyxP2m0iekprGDjN9LPKK2fFlkwgtvAlSek7K-rpAQNGTycwKWnBRxLIQJg)

#### After asset selection or upload:

![](https://lh3.googleusercontent.com/l12sDLtCetBSZiLf-3w9rkvfYcW-onUQHDi0F5n9EovD4AUPh5aFzyHXZJtzy8U4pZ65gF80sC1BJ5CEDqvKZeVhvKLSySl97veuIlhmc-511F8dv7hQJoMlizsmumCQvhKjWDvK_fBPGEEVMLO6MAGzoFeXFU2GivuezDxwVjpc8gNHGPR8XzFf_ylApA)

