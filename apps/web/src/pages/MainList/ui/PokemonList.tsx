import classNames from "classnames/bind";
import { PokemonCard } from "components/PokemonCard";
import { ListItem } from "../MainList";

import styles from "./PokemonList.module.scss";
import AdSlot from "./AdSlot";

const cx = classNames.bind(styles);

interface PokemonListProps {
  items: ListItem[];
}

export default function PokemonList({ items }: PokemonListProps) {
  return (
    <div className={cx("List-layout")}>
      {items.map((item) => {
        if (item.type === "ad") {
          return <AdSlot key={`ad-${item.index}`} index={item.index} />;
        }
        const pokemon = item.data;
        const pokemonId = Number(pokemon.url.match(/(?<=\b\/)\d+/)?.["0"]);

        return (
          <PokemonCard key={pokemon.name} name={pokemon.name} id={pokemonId} />
        );
      })}
    </div>
  );
}
