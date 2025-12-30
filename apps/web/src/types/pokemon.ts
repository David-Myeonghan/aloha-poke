export interface SpritesType {
  front_default: string;
  other: {
    dream_world: { front_default: string };
    "official-artwork": { front_default: string };
  };
}

export interface StatsType {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonDetailResponseType {
  sprites: SpritesType;
  name: string;
  id: number;
  base_experience: number;
  height: number;
  weight: number;
  //
  types: { slot: number; type: { name: string; url: string } }[];
  //
  stats: StatsType[];
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }[];
}

export interface pokemonType {
  name: string;
  url: string;
}

export interface PokemonListResponseType {
  results: pokemonType[];
}
