
async function main() {

  let obs = UtopiaApi.blockPlaced().pipe(
    rxjs.tap((blockPlaceEvent) => {
      if (blockPlaceEvent.type == "grass"){
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
  );

  await rxjs.lastValueFrom(obs);
}
