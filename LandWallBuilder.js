var params = [
  {
    "label": "Height",
    "name": "height",
    "type": "number",
    "required": true,
    "defaultValue": 5
  },
  {
    "label": "Starting Height",
    "name": "startingHeight",
    "type": "number",
    "required": true,
    "defaultValue": 0
  },
  {
    "label": "Block Type",
    "name": "blockType",
    "type": "blockType",
    "required": true
  },
  {
    "label": "Land",
    "name": "land",
    "type": "land",
    "required": true
  }
]


console.log("Running LandWallBuilder");

async function main() {

  var Inputs = await UtopiaApi.getInputsFromUser(params);

  let land = Inputs.land;

  for (let i = land.x1; i < land.x2; i++) {
    for (let j = Inputs.startingHeight; i < Inputs.height; j++) {
      console.log("Placing block at: " + i + ", " + land.y1 + ", " + j);
      UtopiaApi.placeBlock(Inputs.blockType, i, j, land.y1);
    }
  }
  for (let i = land.x1; i < land.x2; i++) {
    for (let j = Inputs.startingHeight; i < Inputs.height; j++) {
      UtopiaApi.placeBlock(Inputs.blockType, i, j, land.y2);
    }
  }
  for (let i = land.y1; i < land.y2; i++) {
    for (let j = Inputs.startingHeight; i < Inputs.height; j++) {
      UtopiaApi.placeBlock(Inputs.blockType, land.x1, j, i);
    }
  }
  for (let i = land.y1; i < land.y2; i++) {
    for (let j = Inputs.startingHeight; i < Inputs.height; j++) {
      UtopiaApi.placeBlock(Inputs.blockType, land.x2, j, i);
    }
  }
}
