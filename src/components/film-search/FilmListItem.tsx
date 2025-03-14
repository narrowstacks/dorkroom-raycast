import { List, Color, Icon } from "@raycast/api";
import { Film } from "../../types/film";
import { FilmDetail } from "./FilmDetail";
import { useFilmActions } from "../../hooks/useFilmActions";
import { FilmActionPanel } from "./FilmActionPanel";
import { FILM_STRINGS } from "../../constants/strings";

interface FilmListItemProps {
  film: Film;
  onSelect: () => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function FilmListItem({ film, onSelect, isSelected, isFavorite, onToggleFavorite }: FilmListItemProps) {
  const { metadata, actions } = useFilmActions({ film, isFavorite, onToggleFavorite });

  return (
    <List.Item
      id={film._id}
      title={`${film.brand} ${film.name}`}
      icon={isFavorite ? Icon.Star : undefined}
      accessories={[
        {
          tag: {
            value: metadata.type,
            color: film.color ? Color.Yellow : Color.SecondaryText,
          },
          tooltip: `${metadata.type} Film`,
        },
      ]}
      detail={
        <List.Item.Detail
          markdown={`<img src="${film.staticImageUrl}" alt="${film.brand} ${film.name}" width="200" height="200" style="object-fit: contain" />`}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.BRAND} text={metadata.brand} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.NAME} text={metadata.name} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.ISO} text={metadata.iso} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.PROCESS} text={metadata.process} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.TYPE} text={metadata.type} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.FORMATS} text={metadata.formats} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.TagList title={FILM_STRINGS.METADATA.KEY_FEATURES}>
                {metadata.keyFeatures.map((feature) => (
                  <List.Item.Detail.Metadata.TagList.Item
                    key={feature._id}
                    text={feature.feature}
                    color={film.color ? "#ff6b6b" : "#ffffff"}
                  />
                ))}
              </List.Item.Detail.Metadata.TagList>
              {metadata.customDescription.length > 0 && (
                <>
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label
                    title={FILM_STRINGS.METADATA.ADDITIONAL_NOTES}
                    text={metadata.customDescription.join("\n")}
                  />
                </>
              )}
              <List.Item.Detail.Metadata.Separator />
              {!film.color && actions.development && (
                <>
                  {actions.development.massiveDev && (
                    <List.Item.Detail.Metadata.Link
                      title="Massive Dev Chart"
                      target={actions.development.massiveDev.url}
                      text={actions.development.massiveDev.title}
                    />
                  )}
                  {actions.development.filmDev && (
                    <List.Item.Detail.Metadata.Link
                      title="FilmDev.org"
                      target={actions.development.filmDev.url}
                      text={actions.development.filmDev.title}
                    />
                  )}
                  <List.Item.Detail.Metadata.Separator />
                </>
              )}
              <List.Item.Detail.Metadata.Link
                title="Buy on B&H Photo"
                target={actions.bhPhoto.url}
                text={actions.bhPhoto.title}
              />
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <FilmActionPanel
          film={film}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
          actions={actions}
        />
      }
    />
  );
}
