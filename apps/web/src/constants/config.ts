export const POKE_BASE_URL = import.meta.env.VITE_POKE_API_URL;

if (!POKE_BASE_URL) {
  console.error("base url undefined!");
}
