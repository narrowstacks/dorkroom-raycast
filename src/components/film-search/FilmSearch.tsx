import { ActionPanel, Action, List, Icon, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { Film } from "../../types/film";
import { clearCache } from "../../lib/films";
import { FilmDetail } from "./FilmDetail";
import { FilmSections } from "./FilmSections";
import { useFilmSearch } from "../../hooks/useFilmSearch";
import { useFavorites } from "../../hooks/useFavorites";

export function FilmSearch() {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const { films, isLoading, error, revalidate, searchText, setSearchText, filterType, setFilterType } = useFilmSearch();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Error loading films",
        message: error.message,
      });
    }
  }, [error]);

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
          onChange={(value) => setFilterType(value as typeof filterType)}
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
        <FilmSections
          films={films}
          favorites={favorites}
          selectedFilm={selectedFilm}
          onSelectFilm={setSelectedFilm}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </List>
  );
}
