import classNames from "classnames/bind";
import { Typography } from "components";
import { StatsType } from "types/pokemon";

import styles from "./PokemonStats.module.scss";

const cx = classNames.bind(styles);

interface PokemonStatsProps {
  stats: StatsType[];
}
export default function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <div className={cx("stat-section")}>
      <div className={cx("stat-box")}>
        {stats.map(({ base_stat, stat }) => (
          <div key={stat.name}>
            <Typography size={"t3"}>{stat.name}</Typography>
            <span className={cx("percentage-bar")}>
              <span
                style={{ width: `${base_stat}%` }}
                className={cx("progress")}
              >
                <span>
                  <Typography size={"t4"}>{base_stat}</Typography>
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
