import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Typography } from "components";
import useIndexChange from "hooks/useIndexChange";
import { useRecentPokemonList } from "hooks/useRecentPokemonList";

import styles from "./RecentView.module.scss";

const cx = classNames.bind(styles);
export default function RecentView() {
  const navigate = useNavigate();

  const { recentPokemonList } = useRecentPokemonList();
  const { index } = useIndexChange(recentPokemonList.length);

  return (
    <>
      {recentPokemonList.length ? (
        <div className={cx("container")}>
          <Typography size={"t2"}>Recently Viewed:&nbsp;</Typography>
          <span onClick={() => navigate(recentPokemonList[index].url)}>
            <Typography size={"t2"}>{recentPokemonList[index].name}</Typography>
          </span>
        </div>
      ) : null}
    </>
  );
}
