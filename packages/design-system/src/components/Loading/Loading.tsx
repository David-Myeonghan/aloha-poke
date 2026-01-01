import { HTMLAttributes } from "react";
import classNames from "classnames/bind";

import styles from "./Loading.module.scss";

export type LoadingSize = "small" | "medium";

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoadingSize;
}

const cx = classNames.bind(styles);

export const Loading = ({
  size = "medium",
  className,
  ...rest
}: LoadingProps) => {
  const loadingClassName = cx(size, "spinner", className);

  return <div className={loadingClassName} role="status" aria-busy="true" {...rest} />;
};
