import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mydav/design-system";
import { ROUTES } from "constants/routers";

import styles from "./ErrorPage.module.scss";

const cx = classNames.bind(styles);
export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className={cx("error-layout")}>
      <Typography size={"t1"}>Something&apos;s wrong!</Typography>
      <Button onClick={() => navigate(ROUTES.index)}>Home</Button>
    </div>
  );
}
