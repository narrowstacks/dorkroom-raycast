import { ActionPanel, Action, List, Icon, showToast, Toast, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCachedPromise } from "@raycast/utils";
import { Film } from "./types/film";
import { getCachedFilms, clearCache } from "./lib/films";
import { FilmListItem } from "./components/FilmListItem";
import { FilmDetail } from "./components/FilmDetail";
import { fuzzySearchFilms, normalizeNames } from "./lib/search";

type FilterType = "all" | "bw" | "color";

// Helper function to get favorites from local storage
async function getFavorites(): Promise<string[]> {
  try {
    const favorites = await LocalStorage.getItem<string>("favoriteFilms");
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
}

// Helper function to save favorites to local storage
async function saveFavorites(favorites: string[]) {
  try {
    await LocalStorage.setItem("favoriteFilms", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export default function Command() {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const { data: rawFilms, isLoading, error, revalidate } = useCachedPromise(getCachedFilms);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  // Normalize film names
  const films = rawFilms?.map(normalizeNames) ?? [];

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Error loading films",
        message: error.message,
      });
    }
  }, [error]);

  const toggleFavorite = async (filmId: string) => {
    const newFavorites = favorites.includes(filmId) ? favorites.filter((id) => id !== filmId) : [...favorites, filmId];

    await saveFavorites(newFavorites);
    setFavorites(newFavorites);
  };

  const filteredFilms = films
    ? fuzzySearchFilms(films, searchText).filter((film) => {
        if (filterType === "all") return true;
        return filterType === "color" ? film.color : !film.color;
      })
    : [];

  // Sort films to show favorites first
  const sortedFilms = [...filteredFilms].sort((a, b) => {
    const aIsFavorite = favorites.includes(a._id);
    const bIsFavorite = favorites.includes(b._id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search by name, brand, process, or type..."
      navigationTitle="Film Search"
      selectedItemId={selectedFilm?._id}
      isShowingDetail
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter by Film Type"
          value={filterType}
          onChange={(value) => setFilterType(value as FilterType)}
        >
          <List.Dropdown.Item title="All Films" value="all" />
          <List.Dropdown.Item title="Black & White" value="bw" />
          <List.Dropdown.Item title="Color" value="color" />
        </List.Dropdown>
      }
      actions={
        <ActionPanel>
          <Action
            title="Refresh Data"
            onAction={async () => {
              await clearCache();
              await showToast({
                style: Toast.Style.Animated,
                title: "Refreshing data...",
              });
              await revalidate();
            }}
            icon={Icon.ArrowClockwise}
          />
        </ActionPanel>
      }
    >
      {error ? (
        <List.EmptyView
          title="Error loading films"
          description={error.message}
          actions={
            <ActionPanel>
              <Action title="Try Again" onAction={revalidate} icon={Icon.ArrowClockwise} />
            </ActionPanel>
          }
        />
      ) : (
        <>
          {favorites.length > 0 && (
            <List.Section title="Favorites" subtitle={favorites.length.toString()}>
              {sortedFilms
                .filter((film) => favorites.includes(film._id))
                .map((film) => (
                  <FilmListItem
                    key={film._id}
                    film={film}
                    onSelect={() => setSelectedFilm(film)}
                    isSelected={selectedFilm?._id === film._id}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(film._id)}
                  />
                ))}
            </List.Section>
          )}
          <List.Section
            title="All Films"
            subtitle={sortedFilms.filter((film) => !favorites.includes(film._id)).length.toString()}
          >
            {sortedFilms
              .filter((film) => !favorites.includes(film._id))
              .map((film) => (
                <FilmListItem
                  key={film._id}
                  film={film}
                  onSelect={() => setSelectedFilm(film)}
                  isSelected={selectedFilm?._id === film._id}
                  isFavorite={false}
                  onToggleFavorite={() => toggleFavorite(film._id)}
                />
              ))}
          </List.Section>
        </>
      )}
    </List>
  );
}
