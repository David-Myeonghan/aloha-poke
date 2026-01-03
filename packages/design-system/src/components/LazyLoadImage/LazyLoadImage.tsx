import { useState, ImgHTMLAttributes } from "react";
import classNames from "classnames/bind";

import { Loading } from "../Loading";
import styles from "./LazyLoadImage.module.scss";

const cx = classNames.bind(styles);

export interface LazyLoadImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  imageSource: string;
  alt?: string;
  fallbackSrc?: string;
}

export const LazyLoadImage = ({
  imageSource,
  alt,
  fallbackSrc,
  className,
  ...rest
}: LazyLoadImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {!isLoaded && !hasError && (
        <div className={cx("loadingBox")}>
          <Loading size="small" />
        </div>
      )}
      <img
        src={hasError && fallbackSrc ? fallbackSrc : imageSource}
        alt={alt}
        loading="lazy"
        className={className}
        style={{ visibility: isLoaded || hasError ? "visible" : "hidden" }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...rest}
      />
    </>
  );
};
