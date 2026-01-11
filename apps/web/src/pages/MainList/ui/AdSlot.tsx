import { useState } from "react";
import classNames from "classnames/bind";
import { LazyLoadImage, Typography } from "@mydav/design-system";

import styles from "./AdSlot.module.scss";

const cx = classNames.bind(styles);

const AD_TEXTS = [
  "Catch them all!",
  "Train your Pokemon today",
  "Become a Pokemon Master",
  "Adventure awaits",
  "Gotta catch 'em all!",
];

interface AdSlotProps {
  index: number;
}

export default function AdSlot({ index }: AdSlotProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const text = AD_TEXTS[index % AD_TEXTS.length];

  return (
    <div className={cx("ad-slot")}>
      <LazyLoadImage
        imageSource={`https://picsum.photos/400/60?random=${index}`}
        alt=""
        className={cx("ad-image", { loaded: isLoaded })}
        onLoad={() => setIsLoaded(true)}
      />
      {isLoaded && (
        <div className={cx("ad-overlay")}>
          <Typography size="t3">{text}</Typography>
          <Typography size="t4">Sponsored</Typography>
        </div>
      )}
    </div>
  );
}
