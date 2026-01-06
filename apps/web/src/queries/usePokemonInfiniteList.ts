import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getPokemonList } from "api/pokemon";

const PAGE_SIZE = 20;

export const usePokemonInfiniteList = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["pokemon-infinite-list"],

    queryFn: ({ pageParam = 0 }) =>
      getPokemonList({ limit: PAGE_SIZE, offset: pageParam }),

    initialPageParam: 0,

    // API가 "다음 페이지가 있는지" 알려주기만 하면 어떤 형태든 사용 가능
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * PAGE_SIZE;
    },
  });
};
