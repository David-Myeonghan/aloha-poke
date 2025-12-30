import { ChangeEvent, useState } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames/bind";
import { Button } from "components";

import styles from "./Header.module.scss";
import RecentView from "./RecentView";

const cx = classNames.bind(styles);

const Header = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
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
            />
            <Button color={"error"} onClick={(e) => console.log(e)}>
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
