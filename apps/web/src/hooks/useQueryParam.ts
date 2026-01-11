import { useLocation } from "react-router-dom";

export function useQueryParam(key: string): string | null {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(key);
}
