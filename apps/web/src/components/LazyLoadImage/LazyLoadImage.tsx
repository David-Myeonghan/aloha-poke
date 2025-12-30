import { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { Loading } from "components";

import styles from "./LazyLoadImage.module.scss";

const cx = classNames.bind(styles);

interface LazyLoadImageProps {
  imageSource: string;
  alt?: string;
}

export default function LazyLoadImage({
  imageSource,
  alt,
}: LazyLoadImageProps) {
  const loadingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadingElement = loadingRef.current;
    const imageElement = imageRef.current;
    const handleLoad = () => {
      if (loadingElement) {
        loadingElement.style.display = "none";
      }
      if (imageElement) {
        imageElement.style.visibility = "visible";
      }
    };

    if (imageElement) {
      imageElement.onload = handleLoad;
    }

    return () => {
      if (imageElement) {
        imageElement.onload = null;
      }
    };
  }, []);

  return (
    <>
      <div ref={loadingRef} className={cx("loading-box")}>
        <Loading size="small" />
      </div>

      <img src={imageSource} alt={alt} loading="lazy" ref={imageRef} />
    </>
  );
}
