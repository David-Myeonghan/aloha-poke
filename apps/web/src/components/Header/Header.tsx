import { ChangeEvent, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Button } from "@mydav/design-system";
import { ROUTES } from "constants/routers";

import styles from "./Header.module.scss";
import RecentView from "./RecentView";

const cx = classNames.bind(styles);

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const handleSearch = () => {
    const trimmed = searchValue.trim().toLowerCase();
    if (trimmed) {
      navigate(`${ROUTES.detail.root}?name=${encodeURIComponent(trimmed)}`);
      // setSearchValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cx("container")}>
      <header className={cx("header")}>
        <div className={cx("logo")}>
          <img src={"/logo/pokemon.webp"} alt="pokemon logo" />
        </div>

        <RecentView />

        <div className={cx("right-section")}>
          <div className={cx("search-box")}>
            <input
              className={cx("search-input")}
              value={searchValue}
              onChange={handleSearchFieldChange}
              onKeyDown={handleKeyDown}
              placeholder="Pokemon name..."
            />
            <Button color={"error"} onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </header>
      <div className={cx("content-wrapper")}>
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
