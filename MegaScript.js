var baseParams = [
  {
    label: "Number with default value required",
    name: "param1",
    type: "number",
    required: true,
    defaultValue: 5,
  },
  {
    label: "Number with options not required",
    name: "param2",
    type: "number",
    options: [
      { key: "5", value: 5 },
      { key: "10", value: 10 },
      { key: "20", value: 20 },
    ],
  },
  {
    label: "Text with default value required",
    name: "param3",
    type: "text",
    required: true,
    defaultValue: "Hello",
  },
  {
    label: "Text with default value not required",
    name: "param4",
    type: "text",
    options: [
      { key: "A", value: "A" },
      { key: "B", value: "B" },
      { key: "C", value: "C" },
    ],
  },
  {
    label: "Selection with default value required",
    name: "param5",
    type: "selection",
    defaultValue: "bedrock",
    required: true,
    options: [
      { key: "grass", value: "grass" },
      { key: "dark_grass", value: "dark_grass" },
      { key: "bedrock", value: "bedrock" },
    ],
  },
  {
    label: "Block Type",
    name: "param6",
    type: "blockType",
    required: true,
    hint: '<span style="color:orange;"><s>Position</s></span>',
  },
  {
    label: "Land",
    name: "param7",
    type: "land",
    required: false,
  },
  {
    label: '<span style="color:red;"><i>Position</i></span>',
    name: "param8",
    type: "position",
    required: true,
    hint: '<span style="color:orange;"><s>Position</s></span>',
  },
  {
    label:
      '<div>Another <span style="color:red;"><i>Fancy</i></span> <span style="font-size:1.6em;color:blue;">label</span></div>',
    name: "param9",
    type: "blockType",
    required: false,
  },
  {
    label: "Name of students",
    name: "param10",
    type: "text",
    required: true,
    isList: true,
  },
  {
    label: "Positions",
    name: "param11",
    type: "position",
    required: true,
    isList: true,
  },
  {
    label: "Block Types",
    name: "param12",
    type: "blockType",
    isList: true,
  },
  {
    label: "Some Numbers",
    name: "param13",
    type: "number",
    isList: true,
    defaultValue: [1, 2, 3],
  },
  {
    label: "File Input",
    name: "param14",
    type: "file",
  },
  {
    label: "File Input2",
    name: "param15",
    type: "file",
    required: true,
    hint: '<span style="color:orange;"><s>Another File input</s></span>',
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("Running MegaScript");

  try {
    let inputs = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser(
        {
          inputs: baseParams,
          gridDescriptor: {
            rows: [
              ["param1", "param1", "param2", "param2"],
              ["param3", "param4", "param4", "param5"],
              ["param6", "param7", "param8", "param9"],
              ["param10", "param11", "param12", "param13"],
              ["param14", "param14", "param15", "param15"],
            ],
            templateRows: "auto auto auto minmax(100px,300px)",
            templateColumns: "repeat(4, 1fr)",
          },
        },
        true
      )
    );
    console.log(inputs);
  } catch (e) {
    console.error(e);
  }

  let playerPos = await rxjs.firstValueFrom(UtopiaApi.getPlayerPosition());
  console.log("Player Position", playerPos);
  let wallet = await rxjs.firstValueFrom(UtopiaApi.getCurrentWallet());
  console.log("Player Wallet Id", wallet);
  let playerLands = await rxjs.firstValueFrom(UtopiaApi.getPlayerLands(wallet));
  console.log("Player Lands", playerLands);
  let markers = await rxjs.firstValueFrom(UtopiaApi.getMarkers());
  console.log("Markers", markers);
  try {
    let pb1 = await rxjs.firstValueFrom(
      UtopiaApi.placeBlock("grass", playerPos.x, playerPos.y, playerPos.z)
    );
    console.log("Placed Block at player positions?", pb1);
  } catch (e) {
    console.error(e);
  }
  try {
    let pb2 = await rxjs.firstValueFrom(
      UtopiaApi.placeBlock(
        "grass",
        playerPos.x + 2,
        playerPos.y + 2,
        playerPos.z + 2
      )
    );
    console.log("Placed Block somewhere else?", pb2);
  } catch (e) {
    console.error(e);
  }

  try {
    let inputs2 = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser(
        {
          inputs: baseParams,
          gridDescriptor: {
            rows: [
              ["param3", "param4", "param4", "param5"],
              ["param1", "param1", "param2", "param2"],
              ["param6", "param7", "param8", "param9"],
              ["param10", "param11", "param12", "param13"],
              ["param14", "param14", "param15", "param15"],
            ],
          },
        },
        true
      )
    );
    console.log("Custom grid : ", result);
  } catch (e) {
    console.error(e);
  }

  try {
    let result = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser(
        {
          inputs: baseParams,
        },
        true
      )
    );
    console.log("WithoutGrid : ", result);
  } catch (e) {
    console.error(e);
  }

  try {
    let result = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser(
        {
          inputs: [
            {
              label: "Text with default value required",
              name: "newParam",
              type: "text",
              required: true,
              defaultValue: "Hello",
            },
          ],
        },
        true
      )
    );
    console.log("newParam first : ", result);
  } catch (e) {
    console.error(e);
  }

  try {
    let result = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser(
        {
          inputs: [
            {
              label: "Text with default value required",
              name: "newParam",
              type: "text",
              required: true,
              defaultValue: "Hello",
            },
          ],
        },
        true
      )
    );
    console.log("new param second : ", result);
  } catch (e) {
    console.error(e);
  }
}
