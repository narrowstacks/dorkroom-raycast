import { ActionPanel, Action, List, Icon, useNavigation } from "@raycast/api";
import { Recipe } from "../../types/recipe";
import { RECIPE_STRINGS } from "../../constants/strings";
import { RecipeDetail } from "./RecipeDetail";
import { RecipeForm } from "./RecipeForm";
import { ImportFilmDevForm } from "./ImportFilmDevForm";
import { handleSaveRecipe, handleDeleteRecipe } from "../../utils/recipe-actions";

interface RecipeListProps {
  recipes: Recipe[];
  searchText: string;
  tempUnit: "C" | "F";
  onSearchTextChange: (text: string) => void;
  revalidate: () => void;
}

export function RecipeList({ recipes, searchText, tempUnit, onSearchTextChange, revalidate }: RecipeListProps) {
  const { push } = useNavigation();

  return (
    <List
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchBarPlaceholder={RECIPE_STRINGS.LIST.SEARCH_PLACEHOLDER}
      navigationTitle="Film Development Recipes"
      actions={
        <ActionPanel>
          <Action
            title={RECIPE_STRINGS.COMMON.NEW}
            icon={Icon.Plus}
            onAction={() => push(<RecipeForm onSave={(r) => handleSaveRecipe(r, revalidate)} />)}
          />
          <Action
            title={RECIPE_STRINGS.LIST.SECTIONS.IMPORT_FROM_FILMDEV}
            icon={Icon.Download}
            onAction={() => push(<ImportFilmDevForm onImport={revalidate} />)}
          />
        </ActionPanel>
      }
    >
      {recipes.length > 0 ? (
        <>
          {recipes.map((recipe) => (
            <List.Item
              key={recipe.id}
              title={RECIPE_STRINGS.DETAIL.TITLE(recipe.filmName, recipe.developerName)}
              subtitle={`${recipe.dilution} @ ISO ${recipe.iso}${recipe.pushPull !== 0 ? ` (${recipe.pushPull > 0 ? "+" : ""}${recipe.pushPull})` : ""}`}
              accessories={[
                {
                  text: `${Math.round(recipe.steps[0].duration / 60)}min @ ${
                    tempUnit === "C" ? recipe.steps[0].temperatureC : recipe.steps[0].temperatureF
                  }${RECIPE_STRINGS.FORM.TEMPERATURE_UNIT[tempUnit]}`,
                },
                { icon: recipe.source === "filmdev" ? Icon.Globe : Icon.Person },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    title={RECIPE_STRINGS.COMMON.VIEW}
                    icon={Icon.Eye}
                    onAction={() => push(<RecipeDetail recipe={recipe} />)}
                  />
                  <Action
                    title={RECIPE_STRINGS.COMMON.EDIT}
                    icon={Icon.Pencil}
                    onAction={() =>
                      push(<RecipeForm recipe={recipe} onSave={(r) => handleSaveRecipe(r, revalidate)} />)
                    }
                  />
                  <Action
                    title={RECIPE_STRINGS.COMMON.DELETE}
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={() => handleDeleteRecipe(recipe.id, revalidate)}
                  />
                  <Action
                    title={RECIPE_STRINGS.COMMON.NEW}
                    icon={Icon.Plus}
                    onAction={() => push(<RecipeForm onSave={(r) => handleSaveRecipe(r, revalidate)} />)}
                  />
                  <Action
                    title={RECIPE_STRINGS.LIST.SECTIONS.IMPORT_FROM_FILMDEV}
                    icon={Icon.Download}
                    onAction={() => push(<ImportFilmDevForm onImport={revalidate} />)}
                  />
                </ActionPanel>
              }
            />
          ))}
          {!searchText && (
            <List.Section title={RECIPE_STRINGS.LIST.SECTIONS.ADD_RECIPE}>
              <List.Item
                title={RECIPE_STRINGS.LIST.SECTIONS.CREATE_NEW}
                icon={Icon.Plus}
                actions={
                  <ActionPanel>
                    <Action
                      title={RECIPE_STRINGS.COMMON.CREATE}
                      onAction={() => push(<RecipeForm onSave={(r) => handleSaveRecipe(r, revalidate)} />)}
                    />
                  </ActionPanel>
                }
              />
              <List.Item
                title={RECIPE_STRINGS.LIST.SECTIONS.IMPORT_FROM_FILMDEV}
                icon={Icon.Download}
                actions={
                  <ActionPanel>
                    <Action
                      title={RECIPE_STRINGS.COMMON.IMPORT}
                      onAction={() => push(<ImportFilmDevForm onImport={revalidate} />)}
                    />
                  </ActionPanel>
                }
              />
            </List.Section>
          )}
        </>
      ) : (
        <>
          <List.EmptyView
            icon={Icon.List}
            title={RECIPE_STRINGS.LIST.EMPTY.TITLE}
            description={searchText ? RECIPE_STRINGS.LIST.EMPTY.WITH_SEARCH : RECIPE_STRINGS.LIST.EMPTY.NO_RECIPES}
          />
          {!searchText && (
            <>
              <List.Item
                title={RECIPE_STRINGS.LIST.SECTIONS.CREATE_NEW}
                icon={Icon.Plus}
                actions={
                  <ActionPanel>
                    <Action
                      title={RECIPE_STRINGS.COMMON.CREATE}
                      onAction={() => push(<RecipeForm onSave={(r) => handleSaveRecipe(r, revalidate)} />)}
                    />
                  </ActionPanel>
                }
              />
              <List.Item
                title={RECIPE_STRINGS.LIST.SECTIONS.IMPORT_FROM_FILMDEV}
                icon={Icon.Download}
                actions={
                  <ActionPanel>
                    <Action
                      title={RECIPE_STRINGS.COMMON.IMPORT}
                      onAction={() => push(<ImportFilmDevForm onImport={revalidate} />)}
                    />
                  </ActionPanel>
                }
              />
            </>
          )}
        </>
      )}
    </List>
  );
}
