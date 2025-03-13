import { List, ActionPanel, Action, Color, getPreferenceValues, Icon } from "@raycast/api";
import { Film } from "../types/film";
import { FilmDetail } from "./FilmDetail";
import { generateBHPhotoUrl, generateMassiveDevChartUrl, generateFilmDevUrls } from "../lib/urls";
import { FILM_STRINGS } from "../constants/strings";

interface Preferences {
  tempUnit: "C" | "F";
  preferredDeveloper?: string;
}

const brandColors: Record<string, { color: Color; icon: string }> = {
  Kodak: { color: Color.Orange, icon: "🎞️" },
  Ilford: { color: Color.Green, icon: "🎞️" },
  Fujifilm: { color: Color.Red, icon: "🎞️" },
  CineStill: { color: Color.Blue, icon: "🎞️" },
  Lomography: { color: Color.Purple, icon: "🎞️" },
  ADOX: { color: Color.Magenta, icon: "🎞️" },
  Fomapan: { color: Color.Yellow, icon: "🎞️" },
};

interface FilmListItemProps {
  film: Film;
  onSelect: () => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function FilmListItem({ film, onSelect, isSelected, isFavorite, onToggleFavorite }: FilmListItemProps) {
  const { tempUnit, preferredDeveloper } = getPreferenceValues<Preferences>();
  const brandConfig = brandColors[film.brand] || { color: Color.SecondaryText, icon: "🎞️" };

  const bhPhotoUrl = generateBHPhotoUrl(film);
  const massiveDevChartUrl = generateMassiveDevChartUrl(film, { tempUnit, preferredDeveloper });
  const { showUrl: filmDevShowUrl, searchUrl: filmDevSearchUrl } = generateFilmDevUrls(film, {
    tempUnit,
    preferredDeveloper,
  });

  return (
    <List.Item
      id={film._id}
      title={`${film.brand} ${film.name}`}
      icon={isFavorite ? Icon.Star : undefined}
      accessories={[
        {
          tag: {
            value: film.color ? FILM_STRINGS.FILM_TYPE.COLOR : FILM_STRINGS.FILM_TYPE.BW,
            color: film.color ? Color.Yellow : Color.SecondaryText,
          },
          tooltip: film.color ? `${FILM_STRINGS.FILM_TYPE.COLOR} Film` : `${FILM_STRINGS.FILM_TYPE.BW} Film`,
        },
      ]}
      detail={
        <List.Item.Detail
          markdown={`<img src="${film.staticImageUrl}" alt="${film.brand} ${film.name}" width="200" height="200" style="object-fit: contain" />`}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.BRAND} text={film.brand} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.NAME} text={film.name} />
              <List.Item.Detail.Metadata.Label title={FILM_STRINGS.METADATA.ISO} text={film.iso.toString()} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Label
                title={FILM_STRINGS.METADATA.PROCESS}
                text={film.process.toUpperCase()}
              />
              <List.Item.Detail.Metadata.Label
                title={FILM_STRINGS.METADATA.TYPE}
                text={film.color ? FILM_STRINGS.FILM_TYPE.COLOR : FILM_STRINGS.FILM_TYPE.BW}
              />
              <List.Item.Detail.Metadata.Label
                title={FILM_STRINGS.METADATA.FORMATS}
                text={[film.formatThirtyFive && "35mm", film.formatOneTwenty && "120"].filter(Boolean).join(", ")}
              />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.TagList title={FILM_STRINGS.METADATA.KEY_FEATURES}>
                {film.keyFeatures.map((feature) => (
                  <List.Item.Detail.Metadata.TagList.Item
                    key={feature._id}
                    text={feature.feature}
                    color={film.color ? "#ff6b6b" : "#4a4a4a"}
                  />
                ))}
              </List.Item.Detail.Metadata.TagList>
              {film.customDescription.length > 0 && (
                <>
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label
                    title={FILM_STRINGS.METADATA.ADDITIONAL_NOTES}
                    text={film.customDescription.join("\n")}
                  />
                </>
              )}
              <List.Item.Detail.Metadata.Separator />
              {!film.color && (
                <>
                  {massiveDevChartUrl && (
                    <>
                      <List.Item.Detail.Metadata.Link
                        title="Massive Dev Chart"
                        target={massiveDevChartUrl}
                        text={FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.ALL_TIMES}
                      />
                      {preferredDeveloper && (
                        <List.Item.Detail.Metadata.Link
                          title="Massive Dev Chart"
                          target={massiveDevChartUrl}
                          text={FILM_STRINGS.DEVELOPMENT.MASSIVE_DEV_CHART.DEVELOPER_TIMES(preferredDeveloper)}
                        />
                      )}
                    </>
                  )}
                  {filmDevSearchUrl && (
                    <>
                      {preferredDeveloper && (
                        <List.Item.Detail.Metadata.Link
                          title="FilmDev.org"
                          target={filmDevSearchUrl}
                          text={FILM_STRINGS.DEVELOPMENT.FILMDEV.DEVELOPER_RECIPES(preferredDeveloper)}
                        />
                      )}
                      <List.Item.Detail.Metadata.Link
                        title="FilmDev.org"
                        target={filmDevSearchUrl}
                        text={FILM_STRINGS.DEVELOPMENT.FILMDEV.ALL_RECIPES}
                      />
                    </>
                  )}
                  <List.Item.Detail.Metadata.Separator />
                </>
              )}
              <List.Item.Detail.Metadata.Link
                title="Buy on B&H Photo"
                target={bhPhotoUrl}
                text={FILM_STRINGS.BH_PHOTO.VIEW_PRODUCT}
              />
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.Push
              title={FILM_STRINGS.ACTIONS.VIEW_DETAILS}
              target={
                <FilmDetail film={film} onBack={() => {}} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
              }
              onPush={onSelect}
            />
            <Action
              title={isFavorite ? FILM_STRINGS.FAVORITES.REMOVE : FILM_STRINGS.FAVORITES.ADD}
              onAction={onToggleFavorite}
              icon={isFavorite ? Icon.StarDisabled : Icon.Star}
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
                    shortcut={{ modifiers: ["cmd"], key: "d" }}
                  />
                )}
                {filmDevSearchUrl && (
                  <Action.OpenInBrowser
                    title={FILM_STRINGS.DEVELOPMENT.FILMDEV.DEVELOPER_RECIPES(preferredDeveloper || "")}
                    url={filmDevSearchUrl}
                    icon={Icon.MagnifyingGlass}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
                  />
                )}
              </>
            )}
            <Action.OpenInBrowser
              title={FILM_STRINGS.BH_PHOTO.VIEW_ON_BH}
              url={bhPhotoUrl}
              shortcut={{ modifiers: ["cmd"], key: "b" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
