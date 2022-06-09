var params = [
  {
    label: "Execution time",
    name: "time",
    type: "number",
    required: true,
  },
];

console.log("Running Boring Script");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  try {
    var Inputs = await rxjs.firstValueFrom(
      UtopiaApi.getInputsFromUser({
        inputs: params,
      })
    );

    for (let i = 0; i < Inputs.time; i++) {
      console.log("Sleeping... " + i);
      await sleep(1000);
    }
  } catch (e) {
    console.log("Error catch: " + e);
  }
}
