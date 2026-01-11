import { useMemo } from "react";
import classNames from "classnames/bind";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { useScrollRestoration } from "hooks/useScrollRestoration";
import { useItemsPerRow } from "hooks/useItemsPerRow";
import { Loading } from "@mydav/design-system";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";
import { insertAds } from "./utils";

const ROWS_PER_AD = 4;

const cx = classNames.bind(styles);

function MainList() {
  const itemsPerRow = useItemsPerRow();
  const adInterval = itemsPerRow * ROWS_PER_AD;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const listItems = useMemo(() => {
    const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];
    return insertAds(allPokemon, adInterval);
  }, [data?.pages, adInterval]);

  const { ref } = useIntersectionObserver({
    onChange: () => fetchNextPage(),
    enabled: hasNextPage && isFetchingNextPage === false,
    threshold: 0.5,
    rootMargin: "100px",
  });

  useScrollRestoration("mainListScrollY");

  return (
    <div className={cx("main-list-layout")}>
      <PokemonList items={listItems} />
      <div ref={ref} className={cx("sentinel")}>
        {isFetchingNextPage && <Loading size="small" />}
      </div>
    </div>
  );
}

export default withAsyncBoundary(MainList);
