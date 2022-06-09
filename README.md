## Utopia Plugin

Plugin is a JavaScript file that enables users to build complicated structures easily and add custom features to the game.

## Script Structure

Utopia game engine will lookup an asynchronous function named **main** as the entry point of the plugin execution. Developers must provide the main function like this:

```javascript
// script.js

// ...
async function main() {
  // ...
}
```

## Getting input from user

Developers may ask for user input following these three steps:

1.  Define _inputs descriptor_, i.e, input parameters definition.
2.  Call _UtopiaApi.getInputsFromUser_ method and pass descriptor to it as parameter
3.  Get and use return value of _UtopiaApi.getInputsFromUser_ as the input parameter values

### Writing input Descriptor

A descriptor is a json list which describes input parameters for the plugin. Each input put parameter is defined using the following json structure:

```ts
{
    name: string;
    label?: string;
    hint: string;
    required: boolean;
    type: 'text' | 'number' | 'selection' | 'position' | 'land' | 'blockType';
    options?: { key: string, value: any }[];
    defaultValue?: any;
    isList: boolean = false;
}
```

#### name

The name you are giving to your input. This will be the property name of user submitted value for this field in the return value of _getInputsFromUser_.

#### label

Label for the generated frontend field
The value of this field can also be simple HTML strings like

```html
<span style="color:red;"><i>Fancy Label</i></span>
```

#### hint

Hint for the generated frontend field
The value of this field can also be simple HTML string

```html
<span style="color:orange;"><i>Fancy hint</i></span>
```

#### required

Field can be required or optional. Empty required fields disables the submit button of _inputs dialog_.

#### options

Provides suggested values for 'text', 'number', or 'selection' fields, so users can select from them.
Options is a list of key value pairs in which key is a simple string that represents the value and will be shown to the user.

#### isList

A list of inputs of this type will be displayed if this is true, and user can add or remove entries from manually. A list of positions can, for example, be obtained from the user.

#### defaultValue

Field gets prefilled with this in the generated frontend.
Default value of list inputs would be like : [1, 2, 3] for number field

#### type

| Type        | Description                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 'text'      | Simple text field                                                                                                                                       |
| 'number'    | Simple number field                                                                                                                                     |
| 'selection' | Using this along with options creates a combo box with provided options for user to select from                                                         |
| 'position'  | Getting a position in game from user (This field also allows users to select their current position or any of the marker blocks in the game as a value) |
| 'land'      | Combo box which its values are user owned lands                                                                                                         |
| 'blockType' | A combo box whose values represent the different types of blocks supported in the game                                                                  |
| 'file'      | Getting a file from user                                                                                                                                |

### Example of getting input from user

Consider an example where you want to get two positions from the user and one block type to connect those two positions with that specific block type. Let's call it _BlockBuilder_. Here is how you can do it:

```js
var descriptor = [
  {
    label: "A",
    name: "a",
    type: "position",
    required: true,
  },
  {
    label: "B",
    name: "b",
    type: "position",
    required: true,
  },
  {
    label: "Block Type",
    name: "blockType",
    type: "blockType",
    required: true,
  },
];
var userInputs = await rxjs.firstValueFrom(
  UtopiaApi.getInputsFromUser({
    inputs: descriptor,
  })
);
console.log(userInputs);
```

**WARNING**: UtopiaApi.getInputsFromUser, will returns an error through observable if the user cancels the inputs dialog. So a better approach would be to surround the code with a try catch block:

```js
try {
  var userInputs = await rxjs.firstValueFrom(
    UtopiaApi.getInputsFromUser({
      inputs: descriptor,
    })
  );
  console.log(userInputs);
} catch (e) {
  // Try again or go on without inputs
  console.error(e);
}
```

### Using custom grid in inputs dialog

By default, described fields will be arranged into 3 columns of the same size according to their defemination order.
In order to define custom grid for fields you can pass a _**gridDescriptor**_ object to _getInputFromUser_ method.
Let's say we want the fields in our _BlockBuilder_ example to be aligned so that the first two positions appear next to each other in the first row and the block type goes into the second row.

```js
var userInputs = await rxjs.firstValueFrom(
  UtopiaApi.getInputsFromUser({
    inputs: descriptor,
    gridDescriptor: {
      rows: [
        ["a", "b"],
        ["blockType", "blockType"],
      ],
    },
  })
);
```

We can also define custom rows/column sizes for our grid by providing templateRows/templateColumns in our gridDescriptor.
For example, suppose we want the first column in _BlockBuilder_ to be twice as large as the second column.

```js
var userInputs = await rxjs.firstValueFrom(
  UtopiaApi.getInputsFromUser({
    inputs: descriptor,
    gridDescriptor: {
      rows: [
        ["a", "b"],
        ["blockType", "blockType"],
      ],
      templateColumns: "2fr 1fr",
    },
  })
);
```

You can find more information about templateColumn/templateRows by visiting the links below

- [templateRows](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)
- [templateColumns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)

## Interacting with game

A javascript object named _UtopiaApi_ provides miscellaneous methods to interact with the game.
All UtopiaApi methods returns an [RxJs](https://rxjs.dev/) Observable. Here is how you can get the observable value:

```ts
// Normal subscription
UtopiaApi.currentLand().subscribe(
  (land) => {
    console.log("Land", land);
  },
  (error) => {
    console.error(error);
  }
);

// To have await functionality
let inputs = await rxjs.firstValueFrom(
  UtopiaApi.getInputsFromUser({ inputs: baseParams })
);
console.log(inputs);
```

There are two different type of methods in UtopiaApi:

1. Methods which involve changing something in the game or getting data from it, and afterwards it is completed
2. Methods returning an observable which will continue to receive values throughout the plugin runtime. For example, the _currentLand_ method returns an observable which receives a value every time the player enters a new land

### list of all available methods of the first type

- **_placeBlock_** (type: string, x: number, y: number, z: number) -> boolean  
  As the name suggests you can place blocks in game using this method. This method returns a boolean indicating whether or not the block is placed in the game. For example placing a block at the exact player position will fail and return false.
  Here's how it's used:

	```ts
	let result = await rxjs.firstValueFrom(UtopiaApi.placeBlock("grass", 1, 2, 3));
	if (result) console.log("Block placed successfully");
	else console.log("Failed to place the block");
	```

- **_placeBlocks_** (blocks: MetaBlock[]) -> Map<Position, boolean>  
  This method allows you to place multiple blocks in game with the option of attaching metablocks to them. For example, the following script puts two white blocks and one stone block above them with an nft block attach to it. You can see the result in this [image](https://ipfs.io/ipfs/QmNPaKfXo3R86d9jr2GaFmtEnbt88bNXBpAeZbEzcUYtFD). This [file](https://github.com/Utopia42-club/utopia42-web/blob/develop/src/app/utopia-game/plugin/models.ts) shows the possible formats for the MetaBlock type.
  ```ts
   const nftWallData = [
        {
            position: { x: -3066, y: 32, z: -860 },
            type: { blockType: "#ffffff" }
        },
        {
            position: { x: -3066, y: 33, z: -860 },
            type: { blockType: "#ffffff" }
        },
        {
            position: { x: -3066, y: 34, z: -860 },
            type: {
                blockType: "stone",
                metaBlock: {
                    type: "nft",
                    properties: {
                        back: {
                            url: "https://ipfs.io/ipfs/Qmci1pGaUmvb6StPxdGp1WqfK9QjPjdf43nCbY5LJ9y1MY",
                            width: 2, height: 2,
                            marketUrl: "https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/4671",
                        },
                    },
                },
            },
        },
    ]
    let result = await rxjs.firstValueFrom(UtopiaApi.placeBlocks(nftWallData));
    // result --> {(-3066, 32, -860): true, (-3066, 33, -860): true, (-3066, 34, -860): true}
   ```
- **_selectBlocks_** (positions: Position[]) -> Map<Position, boolean>  
  Used for selecting blocks (and the attached metablocks) at specific positions. For instance `UtopiaApi.selectBlocks([{x: 0, y:33, z: 0}, {x: 0, y:34, z: 0}])` will try to select blocks at given positions, and returns a boolean for each, indicating whether the selection was successful or not.

- **_getPlayerPosition_** ( ) -> { x:number, y:number, z:number }  
  Used for getting current position of player in game
  ```ts
  let position = await rxjs.firstValueFrom(UtopiaApi.getPlayerPosition());
  console.log(
    "Player is now at x:" + position.x + " y:" + position.y + " z:" + position.z
  );
  ```
- **_getBlockTypes_** ( ) -> string[]  
  Used for getting list of supported block types in game
  ```ts
  let types = await rxjs.firstValueFrom(UtopiaApi.getBlockTypes());
  ```
- **_getPlayerLands_** ( ) -> Land[]  
  Used for getting list of user lands
  ```ts
  let lands = await rxjs.firstValueFrom(UtopiaApi.getPlayerLands());
  // Land object has the following properties:
  // id?: number;
  // startCoordinate: { x:number, y:number, z:number };
  // endCoordinate: { x:number, y:number, z:number };
  // time?: number;
  // ipfsKey?: string;
  // isNft?: boolean;
  // owner?: string;
  // properties?: { color:string };
  ```
- **_getCurrentLand_** ( ) -> Land  
  Used for getting the land user is currently in
  ```ts
  let land = await rxjs.firstValueFrom(UtopiaApi.getCurrentLand());
  ```
- **_getMarkers_** ( ) -> Marker[]  
  Used for getting available markers in game
  ```ts
  let markers = await rxjs.firstValueFrom(UtopiaApi.getMarkers());
  // Marker object has the following properties:
  // position: { x:number, y:number, z:number };
  // name?: string;
  ```
- **_getCurrentWallet_** ( ) -> string  
  Used for getting current wallet address that user is logged in with
  ```ts
  let wallet = await rxjs.firstValueFrom(UtopiaApi.getCurrentWallet());
  ```

### list of all available methods of the second type

- **_currentLand_** ( ) -> Land  
  Returns an observable which receives a value every time the player enters a new land
  ```ts
  UtopiaApi.currentLand().subscribe(
    (land) => {
      console.log("New land :", land);
    },
    (error) => {
      console.error(error);
    }
  );
  // Land object has the following properties:
  // id?: number;
  // startCoordinate: { x:number, y:number, z:number };
  // endCoordinate: { x:number, y:number, z:number };
  // time?: number;
  // ipfsKey?: string;
  // isNft?: boolean;
  // owner?: string;
  // properties?: { color:string };
  ```

- **_blockPlaced_** ( ) -> BlockPlaceEvent  
  Returns an observable which receives a value every time the player places a block
  ```ts
  UtopiaApi.blockPlaced().subscribe(
    (event) => {
      console.log("event", event);
    },
    (error) => {
      console.error(error);
    }
  );
  // BlockPlaceEvent object has the following properties:
  // position: {x : number, y : number, z : number};
  // type: string; // like 'grass'
  ```

#### Example of using the second type of methods in a plugin
Imagine that we want the grass block to turn into a random color block every time the user places it, then we want to stop doing that when the user places a dirt block. This can be done as follows:

```js
async function main() {

  let obs = UtopiaApi.blockPlaced().pipe(
    rxjs.tap((blockPlaceEvent) => {
      if (blockPlaceEvent.type == "grass") {
        var randomColor = "#000000".replace(/0/g, function () {
          return (~~(Math.random() * 16)).toString(16);
        });
        UtopiaApi.placeBlock(
          randomColor,
          blockPlaceEvent.position.x,
          blockPlaceEvent.position.y,
          blockPlaceEvent.position.z
        ).subscribe();
      }
    }),
    rxjs.takeWhile((event) => event.type != "dirt")
  );

  await rxjs.lastValueFrom(obs);
}
```
Note that normal subscription does not block the execution of the main method, and reaching the end of main will terminate the plugin, so in order to keep the plugin running over time, There should be await call in our async function that blocks the executions until our desired time, which is until the place event of a 'dirt' block.