import { useSuspenseQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "api/pokemon";

export const usePokemonDetail = (idOrName: string) => {
  return useSuspenseQuery({
    queryKey: usePokemonDetail.getKey(idOrName),
    queryFn: () => getPokemonDetail(idOrName),
  });
};

usePokemonDetail.getKey = (idOrName: string) => ["pokemon-detail", idOrName];
