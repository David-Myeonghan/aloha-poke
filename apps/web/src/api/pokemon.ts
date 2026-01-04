import { pokemonDetail, pokemonList, PokemonListParam } from "constants/api";
import { api } from "utils/ajax/instance";
import {
  PokemonDetailResponseType,
  PokemonListResponseType,
} from "types/pokemon";

export const getPokemonList = async (params: PokemonListParam) =>
  (await api.get(pokemonList(params)).json()) as PokemonListResponseType;

export const getPokemonDetail = async (idOrName: string) =>
  (await api.get(pokemonDetail(idOrName)).json()) as PokemonDetailResponseType;
