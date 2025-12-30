import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  RECENT_VIEW,
  RecentViewedPokemon,
} from "utils/IndexedDB/IndexedDBSingleton";
import { getAllRecentPokemon } from "store/recentPokemon";

export function useRecentPokemonList() {
  const { pathname } = useLocation();
  const [recentPokemonList, setRecentPokemonList] = useState<
    RecentViewedPokemon[]
  >([]);

  useEffect(() => {
    getAllRecentPokemon(RECENT_VIEW).then((res) => {
      setRecentPokemonList(res);
    });
  }, [pathname]);

  return { recentPokemonList };
}
