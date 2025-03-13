import { ActionPanel, Action, Detail, Icon, getPreferenceValues } from "@raycast/api";
import { Film } from "../types/film";
import { clearCache } from "../lib/films";
import { generateBHPhotoUrl, generateMassiveDevChartUrl, generateFilmDevUrls } from "../lib/urls";
import { FILM_STRINGS } from "../constants/strings";

interface FilmDetailProps {
  film: Film;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

interface Preferences {
  tempUnit: "C" | "F";
  preferredDeveloper?: string;
}

export function FilmDetail({ film, onBack, isFavorite, onToggleFavorite }: FilmDetailProps) {
  const { tempUnit, preferredDeveloper } = getPreferenceValues<Preferences>();

  // Create URLs for external services
  const bhPhotoUrl = generateBHPhotoUrl(film);
  const massiveDevChartUrl = generateMassiveDevChartUrl(film, { tempUnit, preferredDeveloper });
  const { showUrl: filmDevShowUrl, searchUrl: filmDevSearchUrl } = generateFilmDevUrls(film, {
    tempUnit,
    preferredDeveloper,
  });

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
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.ISO} text={film.iso.toString()} />
          <Detail.Metadata.Label title={FILM_STRINGS.METADATA.PROCESS} text={film.process.toUpperCase()} />
          <Detail.Metadata.Label
            title={FILM_STRINGS.METADATA.TYPE}
            text={film.color ? FILM_STRINGS.FILM_TYPE.COLOR : FILM_STRINGS.FILM_TYPE.BW}
          />
          <Detail.Metadata.Label
            title={FILM_STRINGS.METADATA.FORMATS}
            text={[film.formatThirtyFive && "35mm", film.formatOneTwenty && "120"].filter(Boolean).join(", ")}
          />
          <Detail.Metadata.Separator />
          {!film.color && (
            <>
              {massiveDevChartUrl && (
                <>
                  <Detail.Metadata.Link
                    title="Massive Dev Chart"
                    target={massiveDevChartUrl}
                    text={FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.ALL_TIMES}
                  />
                  {preferredDeveloper && (
                    <Detail.Metadata.Link
                      title="Preferred Developer Times"
                      target={massiveDevChartUrl}
                      text={FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.DEVELOPER_TIMES(preferredDeveloper)}
                    />
                  )}
                </>
              )}
              {filmDevSearchUrl && (
                <>
                  <Detail.Metadata.Link
                    title="FilmDev.org"
                    target={filmDevSearchUrl}
                    text={FILM_STRINGS.DEVELOPMENT.FILMDEV.ALL_RECIPES}
                  />
                  {preferredDeveloper && (
                    <Detail.Metadata.Link
                      title="FilmDev.org"
                      target={filmDevSearchUrl}
                      text={FILM_STRINGS.DEVELOPMENT.FILMDEV.DEVELOPER_RECIPES(preferredDeveloper)}
                    />
                  )}
                </>
              )}
              <Detail.Metadata.Separator />
            </>
          )}
          <Detail.Metadata.Link title="Search on B&H" target={bhPhotoUrl} text={FILM_STRINGS.BH_PHOTO.VIEW_ON_BH} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action title={FILM_STRINGS.ACTIONS.BACK_TO_LIST} onAction={onBack} icon={Icon.ArrowLeft} />
            <Action
              title={isFavorite ? FILM_STRINGS.FAVORITES.REMOVE : FILM_STRINGS.FAVORITES.ADD}
              onAction={onToggleFavorite}
              icon={isFavorite ? Icon.Star : undefined}
              shortcut={{ modifiers: ["cmd"], key: "f" }}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            {!film.color && (
              <>
                {massiveDevChartUrl && (
                  <Action.OpenInBrowser
                    title={
                      preferredDeveloper
                        ? FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.DEVELOPER_TIMES(preferredDeveloper)
                        : FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.ALL_TIMES
                    }
                    url={massiveDevChartUrl}
                    icon={Icon.Clock}
                  />
                )}
                {filmDevSearchUrl && (
                  <Action.OpenInBrowser
                    title={FILM_STRINGS.DEVELOPMENT.FILMDEV.DEVELOPER_RECIPES(preferredDeveloper || "")}
                    url={filmDevSearchUrl}
                    icon={Icon.MagnifyingGlass}
                  />
                )}
              </>
            )}
            <Action.OpenInBrowser title={FILM_STRINGS.BH_PHOTO.VIEW_ON_BH} url={bhPhotoUrl} />
            <Action title={FILM_STRINGS.ACTIONS.CLEAR_CACHE} onAction={clearCache} icon={Icon.Trash} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
