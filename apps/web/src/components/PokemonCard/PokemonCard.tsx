import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage, Typography } from "@mydav/design-system";
import { ROUTES } from "constants/routers";

import styles from "./PokemonCard.module.scss";

const cx = classNames.bind(styles);

interface PokemonCardProps {
  name: string;
  id: number;
}

export default function PokemonCard({ name, id }: PokemonCardProps) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`${ROUTES.detail.root}?name=${name}`);

  return (
    <div
      className={cx("card")}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      tabIndex={0}
      role="button"
    >
      <LazyLoadImage
        imageSource={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
        alt={name}
      />
      <Typography size="t3">{name}</Typography>
    </div>
  );
}
