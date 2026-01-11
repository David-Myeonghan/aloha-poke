import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mydav/design-system";
import { ROUTES } from "constants/routers";
import { useQueryParam } from "hooks/useQueryParam";

import styles from "./NotFoundPage.module.scss";

const cx = classNames.bind(styles);

export default function NotFoundPage() {
  const paramName = useQueryParam("name");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(ROUTES.index);
  };

  return (
    <div className={cx("not-found-layout")}>
      <Typography size="t2">Not found &quot;{paramName}&quot;</Typography>
      <Button onClick={handleBackClick} color="primary">
        Back to List
      </Button>
    </div>
  );
}
