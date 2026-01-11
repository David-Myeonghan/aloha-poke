import { pokemonType } from "types/pokemon";

export type ListItem =
  | { type: "pokemon"; data: pokemonType }
  | { type: "ad"; index: number };

export function insertAds(
  pokemonList: pokemonType[],
  adInterval: number,
): ListItem[] {
  const result: ListItem[] = [];

  pokemonList.forEach((pokemon, i) => {
    result.push({ type: "pokemon", data: pokemon });

    if ((i + 1) % adInterval === 0) {
      result.push({ type: "ad", index: Math.floor(i / adInterval) });
    }
  });

  return result;
}
