import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mydav/design-system";
import { ROUTES } from "constants/routers";

import styles from "./NotFoundPage.module.scss";

const cx = classNames.bind(styles);

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paramName = new URLSearchParams(location.search).get("name");

  return (
    <div className={cx("not-found-layout")}>
      <Typography size="t2">Not found &quot;{paramName}&quot;</Typography>
      <Button onClick={() => navigate(ROUTES.index)} color="primary">
        Back to List
      </Button>
    </div>
  );
}
