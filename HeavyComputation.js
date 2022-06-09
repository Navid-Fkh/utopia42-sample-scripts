var params = [
  {
    label: "I",
    name: "i",
    type: "number",
    required: true,
  },
  {
    label: "J",
    name: "j",
    type: "number",
    required: true,
  },
];

console.log("Running HeavyComputation");

async function main() {
  var Inputs = await UtopiaApi.getInputsFromUser(params);

  for (let i = 0; i < Inputs.i; i++) {
    for (let j = 0; j < Inputs.j; j++) {
      let a = i + j;
      let b = i * j;
    }
    console.log(`i: ${i}`);
  }
}
