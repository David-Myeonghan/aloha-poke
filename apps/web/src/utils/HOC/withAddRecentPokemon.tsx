import { ComponentType, useEffect } from "react";
import { addRecentPokemon } from "../../store/recentPokemon";
import { RECENT_VIEW } from "../IndexedDB/IndexedDBSingleton";
import { useLocation } from "react-router-dom";

export default function withAddRecentPokemon<Props = Record<string, never>>(
  WrappedComponent: ComponentType<Props>,
) {
  return (props: Props) => {
    const location = useLocation();
    const paramName = new URLSearchParams(location.search).get("name");
    const currentPath = `${location.pathname}${location.search}`;

    useEffect(() => {
      if (!paramName) return;
      const recent = { name: paramName, url: currentPath };
      addRecentPokemon(RECENT_VIEW, recent);
    }, [currentPath, paramName]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <WrappedComponent {...(props as any)} />;
  };
}
