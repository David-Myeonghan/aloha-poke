import { useMemo } from "react";
import classNames from "classnames/bind";
import { Typography } from "@mydav/design-system";
import { PokemonCard } from "components/PokemonCard";

import styles from "./SuggestionList.module.scss";

const cx = classNames.bind(styles);

const POPULAR_POKEMON = [
  { name: "pikachu", id: 25 },
  { name: "charizard", id: 6 },
  { name: "bulbasaur", id: 1 },
  { name: "mewtwo", id: 150 },
  { name: "eevee", id: 133 },
  { name: "snorlax", id: 143 },
  { name: "gengar", id: 94 },
  { name: "dragonite", id: 149 },
  { name: "lucario", id: 448 },
  { name: "garchomp", id: 445 },
];

function getRandomSuggestions(count: number) {
  const arr = [...POPULAR_POKEMON];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

interface SuggestionListProps {
  count?: number;
  title?: string;
}

export default function SuggestionList({
  count = 3,
  title = "Did you mean?",
}: SuggestionListProps) {
  const suggestions = useMemo(() => getRandomSuggestions(count), [count]);

  return (
    <div className={cx("suggestion-section")}>
      <Typography size="t3">{title}</Typography>
      <div className={cx("suggestion-list")}>
        {suggestions.map((pokemon) => (
          <PokemonCard key={pokemon.name} name={pokemon.name} id={pokemon.id} />
        ))}
      </div>
    </div>
  );
}
