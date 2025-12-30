import React, { MouseEvent, ButtonHTMLAttributes } from "react";
import classNames from "classnames/bind";

import styles from "./Button.module.scss";

export type ButtonSize = "small" | "medium" | "massive";
export type ButtonColor = "primary" | "error";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  size?: ButtonSize;
  color?: ButtonColor;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const cx = classNames.bind(styles);

export const Button = ({
  size = "medium",
  color = "primary",
  onClick,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const buttonClassName = cx("common", size, color, className);

  return (
    <button className={buttonClassName} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
