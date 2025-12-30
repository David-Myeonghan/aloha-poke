import { SpritesType } from "types/pokemon";
import classNames from "classnames/bind";
import { LazyLoadImage } from "components";

import styles from "./PokemonImages.module.scss";

const cx = classNames.bind(styles);

interface PokemonImagesProps {
  sprites: SpritesType;
}
export default function PokemonImages({ sprites }: PokemonImagesProps) {
  const { front_default, other } = sprites;

  return (
    <div className={cx("image-section")}>
      <LazyLoadImage imageSource={front_default} />
      <LazyLoadImage imageSource={other.dream_world.front_default} />
      <LazyLoadImage imageSource={other["official-artwork"].front_default} />
    </div>
  );
}
