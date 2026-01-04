import { PokemonListParam } from "constants/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPokemonList } from "api/pokemon";

export const usePokemonList = (params: PokemonListParam) => {
  return useSuspenseQuery({
    queryKey: usePokemonList.getKey(params),
    queryFn: () => getPokemonList(params),
  });
};

usePokemonList.getKey = (params: PokemonListParam) => ["pokemon-list", params];
