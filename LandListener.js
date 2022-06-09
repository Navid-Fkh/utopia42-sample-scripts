const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("Running LandListener");

  UtopiaApi.currentLand().subscribe(
    (land) => {
      console.log("New land :", land);
    },
    (error) => {
      console.error(error);
    }
  );
  await sleep(500000);
}
