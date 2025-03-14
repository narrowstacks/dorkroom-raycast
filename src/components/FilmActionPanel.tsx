import { ActionPanel, Action, Icon } from "@raycast/api";
import { Film, FilmActions } from "../types/film";
import { FilmDetail } from "./FilmDetail";

interface FilmActionPanelProps {
  film: Film;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect?: () => void;
  isDetailView?: boolean;
  onBack?: () => void;
  actions: FilmActions;
}

export function FilmActionPanel({
  film,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isDetailView,
  onBack,
  actions,
}: FilmActionPanelProps) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        {!isDetailView ? (
          <Action.Push
            title="View Details"
            target={
              <FilmDetail
                film={film}
                onBack={onBack || (() => {})}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            }
            onPush={onSelect}
          />
        ) : (
          <Action title="Back to List" onAction={onBack} icon={Icon.ArrowLeft} />
        )}
        <Action {...actions.favorite} />
      </ActionPanel.Section>

      {!film.color && actions.development && (
        <ActionPanel.Section title="Development">
          {actions.development.massiveDev && (
            <Action.OpenInBrowser
              title={actions.development.massiveDev.title}
              url={actions.development.massiveDev.url}
              shortcut={actions.development.massiveDev.shortcut}
            />
          )}
          {actions.development.filmDev && (
            <Action.OpenInBrowser
              title={actions.development.filmDev.title}
              url={actions.development.filmDev.url}
              shortcut={actions.development.filmDev.shortcut}
            />
          )}
        </ActionPanel.Section>
      )}

      <ActionPanel.Section>
        <Action.OpenInBrowser {...actions.bhPhoto} icon={Icon.Link} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
