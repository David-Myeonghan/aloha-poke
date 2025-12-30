import { Typography } from "components";
import classNames from "classnames/bind";
import { PokemonDetailResponseType } from "types/pokemon";

import styles from "./PokemonIntro.module.scss";

const cx = classNames.bind(styles);

interface PokemonIntroProps {
  data: PokemonDetailResponseType;
}
export default function PokemonIntro({ data }: PokemonIntroProps) {
  return (
    <>
      <div className={cx("intro-section")}>
        <div className={cx("name-box")}>
          <Typography size={"t1"}>{data.name}</Typography>
          <Typography size={"t3"}>#&nbsp;{data.id}</Typography>
        </div>
      </div>

      <div className={cx("character-section")}>
        <div>
          <Typography size={"t2"}>
            {`Height: ${data.height} cm`}&nbsp;
          </Typography>
          <Typography size={"t2"}>{`Weight: ${data.weight} kg`}</Typography>
        </div>

        {data.types.map(({ type, slot }) => (
          <div key={type.name}>
            <Typography size={"t3"}>{type.name}</Typography>
          </div>
        ))}
      </div>
    </>
  );
}
