import ky from "ky";
import { POKE_BASE_URL } from "constants/config";

export const api = ky.create({ prefixUrl: POKE_BASE_URL });
