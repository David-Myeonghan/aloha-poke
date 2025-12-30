import React, { MouseEvent } from "react";
import classNames from "classnames/bind";

import styles from "./Button.module.scss";

type ButtonSizeType = "small" | "medium" | "massive";
type ButtonColorType = "primary" | "error";

interface ButtonProps {
  size?: ButtonSizeType;
  color?: ButtonColorType;
  children?: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const cx = classNames.bind(styles);

const Button = ({
  size = "medium",
  color = "primary",
  onClick,
  children,
}: ButtonProps) => {
  const className = cx("common", size, color);

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
