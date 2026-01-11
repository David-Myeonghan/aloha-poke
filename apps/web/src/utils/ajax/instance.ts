import ky from "ky";
import { POKE_BASE_URL } from "constants/config";

// ky 기본 재시도 대상 status: 408, 413, 429, 500, 502, 503, 504
export const api = ky.create({ prefixUrl: POKE_BASE_URL, retry: 0 });
