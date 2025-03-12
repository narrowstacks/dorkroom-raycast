import { ActionPanel, Action, List, Icon, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCachedPromise } from "@raycast/utils";
import { Film } from "./types/film";
import { getCachedFilms, clearCache } from "./lib/films";
import { FilmListItem } from "./components/FilmListItem";
import { FilmDetail } from "./components/FilmDetail";
import { fuzzySearchFilms, normalizeNames } from "./lib/search";

export default function Command() {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const { data: rawFilms, isLoading, error, revalidate } = useCachedPromise(getCachedFilms);
  const [searchText, setSearchText] = useState("");
  const [isShowingDetail, setIsShowingDetail] = useState(false);

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

  const filteredFilms = films ? fuzzySearchFilms(films, searchText) : [];

  if (isShowingDetail && selectedFilm) {
    return <FilmDetail film={selectedFilm} onBack={() => setIsShowingDetail(false)} />;
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search by name, brand, process, or type..."
      navigationTitle="Film Search"
      selectedItemId={selectedFilm?._id}
      isShowingDetail
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
        <List.Section title="Films" subtitle={filteredFilms.length.toString()}>
          {filteredFilms.map((film) => (
            <FilmListItem
              key={film._id}
              film={film}
              onSelect={() => {
                setSelectedFilm(film);
                setIsShowingDetail(true);
              }}
              isSelected={selectedFilm?._id === film._id}
            />
          ))}
        </List.Section>
      )}
    </List>
  );
}
