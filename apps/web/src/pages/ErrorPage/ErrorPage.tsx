import classNames from "classnames/bind";
import { Typography } from "@mydav/design-system";

import styles from "./ErrorPage.module.scss";

const cx = classNames.bind(styles);
export default function ErrorPage() {
  return (
    <div className={cx("error-layout")}>
      <div className={cx("error-content")}>
        <Typography size={"t1"}>Something&apos;s wrong!</Typography>
      </div>
    </div>
  );
}
