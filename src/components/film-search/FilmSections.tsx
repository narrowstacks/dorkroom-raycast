import { List } from "@raycast/api";
import { Film } from "../../types/film";
import { FilmListItem } from "./FilmListItem";

interface FilmSectionsProps {
  films: Film[];
  favorites: string[];
  selectedFilm: Film | null;
  onSelectFilm: (film: Film) => void;
  onToggleFavorite: (filmId: string) => void;
}

export function FilmSections({ films, favorites, selectedFilm, onSelectFilm, onToggleFavorite }: FilmSectionsProps) {
  // Sort films to show favorites first
  const sortedFilms = [...films].sort((a, b) => {
    const aIsFavorite = favorites.includes(a._id);
    const bIsFavorite = favorites.includes(b._id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

  return (
    <>
      {favorites.length > 0 && (
        <List.Section title="Favorites" subtitle={favorites.length.toString()}>
          {sortedFilms
            .filter((film) => favorites.includes(film._id))
            .map((film) => (
              <FilmListItem
                key={film._id}
                film={film}
                onSelect={() => onSelectFilm(film)}
                isSelected={selectedFilm?._id === film._id}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(film._id)}
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
              onSelect={() => onSelectFilm(film)}
              isSelected={selectedFilm?._id === film._id}
              isFavorite={false}
              onToggleFavorite={() => onToggleFavorite(film._id)}
            />
          ))}
      </List.Section>
    </>
  );
}
