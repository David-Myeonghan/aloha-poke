import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { Loading } from "@mydav/design-system";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";

const cx = classNames.bind(styles);

function MainList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];
  const prevIntersecting = useRef(false);

  const { ref, isIntersecting } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    // false -> true 로 변경될 때만 fetch
    if (
      isIntersecting &&
      !prevIntersecting.current &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    prevIntersecting.current = isIntersecting;
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className={cx("main-list-layout")}>
      <PokemonList pokemonList={allPokemon} />
      <div ref={ref} className={cx("sentinel")}>
        {isFetchingNextPage && <Loading size="small" />}
      </div>
    </div>
  );
}

export default withAsyncBoundary(MainList);
