import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { ROUTES } from "constants/routers";
import { LazyLoadImage, Typography } from "components";
import { pokemonType } from "types/pokemon";

import styles from "./PokemonList.module.scss";

const cx = classNames.bind(styles);

interface PokemonListProps {
  pokemonList: pokemonType[] | undefined;
}

export default function PokemonList({ pokemonList }: PokemonListProps) {
  const navigate = useNavigate();

  return (
    <div className={cx("List-layout")}>
      {pokemonList?.map((pokemon) => {
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
