const pokemon = "pokemon";

export interface PokemonListParam {
  limit: number;
  offset?: number;
}
export const pokemonList = ({ limit = 10, offset }: PokemonListParam) =>
  `${pokemon}?limit=${limit}${offset ? `&offset=${offset}` : ""}`;

export const pokemonDetail = (IdOrName: string) => `pokemon/${IdOrName}`;
