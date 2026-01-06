import classNames from "classnames/bind";
import { usePokemonInfiniteList } from "queries/usePokemonInfiniteList";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { useScrollRestoration } from "hooks/useScrollRestoration";
import { Loading } from "@mydav/design-system";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";

const cx = classNames.bind(styles);

function MainList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList();

  const allPokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const { ref } = useIntersectionObserver({
    onChange: () => fetchNextPage(),
    enabled: hasNextPage && isFetchingNextPage === false,
    threshold: 0.5,
    rootMargin: "100px",
  });

  useScrollRestoration("mainListScrollY");

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
