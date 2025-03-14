import { Detail } from "@raycast/api";
import { Film } from "../types/film";
import { useFilmActions } from "../hooks/useFilmActions";
import { FilmActionPanel } from "./FilmActionPanel";
import { FILM_STRINGS } from "../constants/strings";

interface FilmDetailProps {
  film: Film;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function FilmDetail({ film, onBack, isFavorite, onToggleFavorite }: FilmDetailProps) {
  const { metadata, actions } = useFilmActions({ film, isFavorite, onToggleFavorite, onBack });

  const markdown = `
# ${film.brand} ${film.name}

---

<img src="${film.staticImageUrl}" width="200" height="200" style="object-fit: contain" />

--- 

### Description
${film.description}

### ${FILM_STRINGS.METADATA.KEY_FEATURES}
${film.keyFeatures.map((feature) => `- ${feature.feature}`).join("\n")}

${
  film.customDescription.length > 0
    ? `
### ${FILM_STRINGS.METADATA.ADDITIONAL_NOTES}
${film.customDescription.join("\n")}`
    : ""
}`;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={`${film.brand} ${film.name}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.ISO} text={metadata.iso} />
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.PROCESS} text={metadata.process} />
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.TYPE} text={metadata.type} />
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.FORMATS} text={metadata.formats} />
          <Detail.Metadata.Separator />
          {!film.color && actions.development && (
            <>
              {actions.development.massiveDev && (
                <Detail.Metadata.Link
                  title="Massive Dev Chart"
                  target={actions.development.massiveDev.url}
                  text={actions.development.massiveDev.title}
                />
              )}
              {actions.development.filmDev && (
                <Detail.Metadata.Link
                  title="FilmDev.org"
                  target={actions.development.filmDev.url}
                  text={actions.development.filmDev.title}
                />
              )}
              <Detail.Metadata.Separator />
            </>
          )}
          <Detail.Metadata.Link title="Search on B&H" target={actions.bhPhoto.url} text={actions.bhPhoto.title} />
        </Detail.Metadata>
      }
      actions={
        <FilmActionPanel
          film={film}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onBack={onBack}
          isDetailView={true}
          actions={actions}
        />
      }
    />
  );
}
