import { ActionPanel, Action, Detail, Icon } from "@raycast/api";
import { Film } from "../types/film";
import { clearCache } from "../lib/films";

interface FilmDetailProps {
  film: Film;
  onBack: () => void;
}

export function FilmDetail({ film, onBack }: FilmDetailProps) {
  const markdown = `
# ${film.brand} ${film.name}

---


<img src="${film.staticImageUrl}" width="200" height="200" style="object-fit: contain" />


--- 

### Description
${film.description}

### Key Features
${film.keyFeatures.map((feature) => `- ${feature.feature}`).join("\n")}

${
  film.customDescription.length > 0
    ? `
### Additional Notes
${film.customDescription.join("\n")}`
    : ""
}`;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={`${film.brand} ${film.name}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="ISO" text={film.iso.toString()} />
          <Detail.Metadata.Label title="Process" text={film.process.toUpperCase()} />
          <Detail.Metadata.Label title="Type" text={film.color ? "Color" : "Black & White"} />
          <Detail.Metadata.Label
            title="Formats"
            text={[film.formatThirtyFive && "35mm", film.formatOneTwenty && "120"].filter(Boolean).join(", ")}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="Search on B&H"
            target={`https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(`${film.brand} ${film.name} film`)}`}
            text="View on B&H Photo"
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action title="Back to List" onAction={onBack} icon={Icon.ArrowLeft} />
          <Action.OpenInBrowser
            title="Search on B&H"
            url={`https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(`${film.brand} ${film.name} film`)}`}
          />
          <Action title="Clear Cache" onAction={clearCache} icon={Icon.Trash} />
        </ActionPanel>
      }
    />
  );
}
