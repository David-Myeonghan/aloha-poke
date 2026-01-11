import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { ROUTES } from "constants/routers";
import { LazyLoadImage, Typography } from "@mydav/design-system";
import { ListItem } from "../MainList";

import styles from "./PokemonList.module.scss";
import AdSlot from "./AdSlot";

const cx = classNames.bind(styles);

interface PokemonListProps {
  items: ListItem[];
}

export default function PokemonList({ items }: PokemonListProps) {
  const navigate = useNavigate();

  return (
    <div className={cx("List-layout")}>
      {items.map((item) => {
        if (item.type === "ad") {
          return <AdSlot key={`ad-${item.index}`} index={item.index} />;
        }

        const pokemon = item.data;
        const pokemonId = pokemon.url.match(/(?<=\b\/)\d+/)?.["0"];
        return (
          <div
            key={pokemon.name}
            className={cx("card-layout")}
            onClick={() =>
              navigate(`${ROUTES.detail.root}?name=${pokemon.name}`)
            }
          >
            <LazyLoadImage
              imageSource={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`}
              alt={pokemon.name}
            />
            <Typography size={"t3"}>{pokemon.name}</Typography>
          </div>
        );
      })}
    </div>
  );
}
