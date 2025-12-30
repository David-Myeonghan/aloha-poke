import React, { HTMLAttributes } from "react";
import classNames from "classnames/bind";

import styles from "./Typography.module.scss";

export type TypographySize = "t1" | "t2" | "t3" | "t4";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  size: TypographySize;
  as?: React.ElementType;
}

const cx = classNames.bind(styles);

export const Typography = ({
  children,
  size = "t3",
  as,
  className,
  ...rest
}: TypographyProps) => {
  const typographyClassName = cx(size, className);
  const Tag = as ?? (size === "t1" ? "h1" : size === "t2" ? "h2" : "p");

  return (
    <Tag className={typographyClassName} {...rest}>
      {children}
    </Tag>
  );
};
