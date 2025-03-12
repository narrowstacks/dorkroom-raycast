import { List, ActionPanel, Action } from "@raycast/api";
import { Film } from "../types/film";

interface FilmListItemProps {
  film: Film;
  onSelect: () => void;
  isSelected: boolean;
}

export function FilmListItem({ film, onSelect, isSelected }: FilmListItemProps) {
  return (
    <List.Item
      id={film._id}
      title={`${film.brand} ${film.name}`}
      accessories={[{ text: film.color ? "Color" : "B&W" }]}
      detail={
        <List.Item.Detail
          markdown={`<img src="${film.staticImageUrl}" alt="${film.brand} ${film.name}" width="200" height="200" style="object-fit: contain" />`}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title="Brand" text={film.brand} />
              <List.Item.Detail.Metadata.Label title="Name" text={film.name} />
              <List.Item.Detail.Metadata.Label title="ISO" text={film.iso.toString()} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Label title="Process" text={film.process.toUpperCase()} />
              <List.Item.Detail.Metadata.Label title="Type" text={film.color ? "Color" : "Black & White"} />
              <List.Item.Detail.Metadata.Label
                title="Formats"
                text={[film.formatThirtyFive && "35mm", film.formatOneTwenty && "120"].filter(Boolean).join(", ")}
              />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.TagList title="Key Features">
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
                  <List.Item.Detail.Metadata.Label title="Additional Notes" text={film.customDescription.join("\n")} />
                </>
              )}
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Link
                title="Buy on B&H Photo"
                target={`https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(
                  `${film.brand} ${film.name} film`,
                )}`}
                text="View Product"
              />
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          <Action title="View Details" onAction={onSelect} />
          <Action.OpenInBrowser
            title="View on B&H Photo"
            url={`https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(`${film.brand} ${film.name} film`)}`}
            shortcut={{ modifiers: ["cmd"], key: "b" }}
          />
        </ActionPanel>
      }
    />
  );
}
