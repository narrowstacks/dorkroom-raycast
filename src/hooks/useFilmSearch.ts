import { useCachedPromise } from "@raycast/utils"
import { useState } from "react"
import { Film } from "../types/film"
import { getCachedFilms } from "../lib/films"
import { fuzzySearchFilms, normalizeNames } from "../lib/search"

export type FilterType = "all" | "bw" | "color"

export function useFilmSearch() {
  const { data: rawFilms, isLoading, error, revalidate } = useCachedPromise(getCachedFilms)
  const [searchText, setSearchText] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")

  // Normalize film names
  const films = rawFilms?.map(normalizeNames) ?? []

  const filteredFilms = films
    ? fuzzySearchFilms(films, searchText).filter((film) => {
        if (filterType === "all") return true
        return filterType === "color" ? film.color : !film.color
      })
    : []

  return {
    films: filteredFilms,
    isLoading,
    error,
    revalidate,
    searchText,
    setSearchText,
    filterType,
    setFilterType
  }
} 