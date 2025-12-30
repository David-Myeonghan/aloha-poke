import classNames from "classnames/bind";
import React from "react";

import styles from "./Loading.module.scss";

interface LoadingProps {
  size?: "small" | "medium";
}

const cx = classNames.bind(styles);
export default function Loading({ size = "medium" }: LoadingProps) {
  const className = cx(size, "spinner");

  return <div className={className}></div>;
}
