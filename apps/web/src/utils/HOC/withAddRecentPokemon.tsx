import { ComponentType, useEffect } from "react";
import { addRecentPokemon } from "../../store/recentPokemon";
import { RECENT_VIEW } from "../IndexedDB/IndexedDBSingleton";
import { useLocation } from "react-router-dom";

export default function withAddRecentPokemon<Props = Record<string, never>>(
  WrappeComponent: ComponentType<Props>,
) {
  return (props: Props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramName = queryParams.get("name");
    const currentPath = `${location.pathname}${location.search}`;

    useEffect(() => {
      if (!queryParams) return;
      const recent = { name: paramName ?? "", url: currentPath };
      addRecentPokemon(RECENT_VIEW, recent);
    }, [queryParams, currentPath]);

    return <WrappeComponent {...(props as any)} />;
  };
}
