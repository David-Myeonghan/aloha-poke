import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";

import { usePokemonDetail } from "hooks/usePokemonDetail";
import { Button, Loading } from "components";
import { ROUTES } from "constants/routers";
import { withAsyncBoundary, withAddRecentPokemon } from "utils/HOC";
import { ErrorPage } from "pages/ErrorPage";

import styles from "./DetailPage.module.scss";
import PokemonImages from "./ui/PokemonImages";
import PokemonStats from "./ui/PokemonStats";
import PokemonIntro from "./ui/PokemonIntro";

const cx = classNames.bind(styles);
function DetailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramName = queryParams.get("name");

  const navigate = useNavigate();
  const { data } = usePokemonDetail(paramName ?? "");

  return (
    <div className={cx("container")}>
      {/* Back Button */}
      <div className={cx("button-section")}>
        <Button onClick={() => navigate(ROUTES.index)} color={"primary"}>
          Back
        </Button>
      </div>

      <PokemonImages sprites={data.sprites} />
      <PokemonIntro data={data} />
      <PokemonStats stats={data.stats} />
    </div>
  );
}

export default withAsyncBoundary(withAddRecentPokemon(DetailPage), {
  pendingFallback: <Loading />,
  rejectedFallback: <ErrorPage />,
});
