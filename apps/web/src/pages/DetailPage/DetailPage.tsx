import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

import { usePokemonDetail } from "queries/usePokemonDetail";
import { Button } from "@mydav/design-system";
import { ROUTES } from "constants/routers";
import { useQueryParam } from "hooks/useQueryParam";
import { withAsyncBoundary, withAddRecentPokemon } from "utils/HOC";
import NotFoundPage from "pages/NotFoundPage";

import styles from "./DetailPage.module.scss";
import PokemonImages from "./ui/PokemonImages";
import PokemonStats from "./ui/PokemonStats";
import PokemonIntro from "./ui/PokemonIntro";

const cx = classNames.bind(styles);

function DetailPage() {
  const paramName = useQueryParam("name");
  const navigate = useNavigate();
  const { data } = usePokemonDetail(paramName ?? "");

  const handleBackClick = () => {
    navigate(ROUTES.index);
  };

  return (
    <div className={cx("container")}>
      {/* Back Button */}
      <div className={cx("button-section")}>
        <Button onClick={handleBackClick} color={"primary"}>
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
  rejectedFallback: <NotFoundPage />,
});
