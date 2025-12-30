import classNames from "classnames/bind";
import { usePokemonList } from "hooks/usePokemonList";
import Loading from "components/Loading/Loading";
import { ErrorPage } from "pages/ErrorPage";
import { withAsyncBoundary } from "utils/HOC";

import styles from "./MainList.module.scss";
import PokemonList from "./ui/PokemonList";

const cx = classNames.bind(styles);
function MainList() {
  const { data } = usePokemonList({ limit: 20 });

  return (
    <div className={cx("main-list-layout")}>
      <PokemonList pokemonList={data?.results} />
    </div>
  );
}

export default withAsyncBoundary(MainList, {
  pendingFallback: <Loading />,
  rejectedFallback: <ErrorPage />,
});
