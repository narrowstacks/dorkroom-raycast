import { useEffect, useState } from "react";
import { List, ActionPanel, Action, Icon, confirmAlert } from "@raycast/api";
import { BorderTemplate } from "../../lib/border-calculator/types";
import { getTemplates, deleteTemplate, searchTemplates } from "../../lib/border-calculator/storage";
import { TemplateDetail } from "./TemplateDetail";
import { TemplateForm } from "./TemplateForm";

export function TemplateList() {
  const [templates, setTemplates] = useState<BorderTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  // Force a refresh when needed
  const [refreshKey, setRefreshKey] = useState(0);

  // Load templates when the component mounts or refreshKey changes
  useEffect(() => {
    loadTemplates();
  }, [refreshKey]);

  async function loadTemplates() {
    setIsLoading(true);
    try {
      const loadedTemplates = await getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(query: string) {
    setSearchText(query);
    setIsLoading(true);
    try {
      const results = await searchTemplates(query);
      setTemplates(results);
    } catch (error) {
      console.error("Failed to search templates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      await confirmAlert({
        title: "Delete Template",
        message: `Are you sure you want to delete "${name}"?`,
        primaryAction: { title: "Delete" },
      })
    ) {
      setIsLoading(true);
      try {
        await deleteTemplate(id);
        await loadTemplates();
      } catch (error) {
        console.error("Failed to delete template:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  // Function to force a refresh of the template list
  const refreshTemplates = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={handleSearch}
      searchText={searchText}
      searchBarPlaceholder="Search templates..."
      navigationTitle="Border Calculator"
      actions={
        <ActionPanel>
          <Action.Push
            title="New Template"
            target={<TemplateForm onTemplateCreated={refreshTemplates} />}
            icon={Icon.Plus}
          />
        </ActionPanel>
      }
    >
      <List.Section title="Actions">
        <List.Item
          icon={Icon.Plus}
          title="Create New Template"
          actions={
            <ActionPanel>
              <Action.Push
                title="Create Template"
                target={<TemplateForm onTemplateCreated={refreshTemplates} />}
                icon={Icon.Plus}
              />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Templates">
        {templates.map((template) => (
          <List.Item
            key={template.id}
            icon={Icon.Document}
            title={template.name}
            subtitle={`${template.paperDimensions.width}×${template.paperDimensions.height}" - ${template.aspectRatio.width}:${template.aspectRatio.height}`}
            actions={
              <ActionPanel>
                <Action.Push
                  title="View Details"
                  target={
                    <TemplateDetail
                      template={template}
                      onDeleteTemplate={() => handleDelete(template.id, template.name)}
                      onTemplateUpdated={refreshTemplates}
                      onBack={() => refreshTemplates()}
                    />
                  }
                  icon={Icon.Eye}
                />
                <Action
                  title="Delete Template"
                  icon={Icon.Trash}
                  shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                  onAction={() => handleDelete(template.id, template.name)}
                  style={Action.Style.Destructive}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      {templates.length === 0 && !searchText && (
        <List.EmptyView
          icon={Icon.Document}
          title="No Templates"
          description="Create a new template to get started."
          actions={
            <ActionPanel>
              <Action.Push
                title="New Template"
                target={<TemplateForm onTemplateCreated={refreshTemplates} />}
                icon={Icon.Plus}
              />
            </ActionPanel>
          }
        />
      )}

      {templates.length === 0 && searchText && (
        <List.EmptyView icon={Icon.Document} title="No Results" description="No templates matching your search." />
      )}
    </List>
  );
}
