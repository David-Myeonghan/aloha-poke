import { Outlet, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Button } from "@mydav/design-system";

import { ROUTES } from "constants/routers";
import { useSearch } from "hooks/useSearch";
import styles from "./Header.module.scss";
import RecentView from "./RecentView";

const cx = classNames.bind(styles);

const Header = () => {
  const navigate = useNavigate();
  const {
    searchValue,
    handleChange,
    handleKeyDown,
    handleSearch,
    clearSearch,
  } = useSearch({
    onSearch: (term) => {
      navigate(`${ROUTES.detail.root}?name=${encodeURIComponent(term)}`);
    },
  });

  return (
    <div className={cx("container")}>
      <header className={cx("header")}>
        <div className={cx("logo")}>
          <img src={"/logo/pokemon.webp"} alt="pokemon logo" />
        </div>

        <RecentView />

        <div className={cx("right-section")}>
          <div className={cx("search-box")}>
            <div className={cx("search-input-wrapper")}>
              <input
                className={cx("search-input")}
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Pokemon name..."
              />
              {searchValue && (
                <button
                  className={cx("clear-button")}
                  onClick={clearSearch}
                  type="button"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
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
