export function getRandomPokemonIds(number: number) {
  const MAX_ID = 1000;
  const ids = [];
  for (let i = 0; i < number; i++) {
    const randomId = Math.floor(Math.random() * MAX_ID) + 1;
    ids.push(randomId.toString());
  }
  return ids;
}
