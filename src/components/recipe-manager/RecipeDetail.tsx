import { ActionPanel, Action, Icon, Detail, useNavigation, getPreferenceValues } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { Recipe } from "../../types/recipe";
import { RECIPE_STRINGS } from "../../constants/strings";
import { RecipeForm } from "./RecipeForm";
import { ImportFilmDevForm } from "./ImportFilmDevForm";
import { deleteRecipe, getSavedRecipes } from "../../lib/recipes";
import { handleDeleteRecipe, handleSaveRecipe } from "../../utils/recipe-actions";

interface Preferences {
  tempUnit: "C" | "F";
}

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { tempUnit } = getPreferenceValues<Preferences>();
  const { push, pop } = useNavigation();
  const { revalidate } = useCachedPromise(getSavedRecipes);

  const markdown = `
# ${RECIPE_STRINGS.DETAIL.TITLE(recipe.filmName, recipe.developerName)}

## ${RECIPE_STRINGS.DETAIL.SECTIONS.DEVELOPMENT_DETAILS}
- **${RECIPE_STRINGS.DETAIL.DETAILS.DILUTION}** ${recipe.dilution}
- **${RECIPE_STRINGS.DETAIL.DETAILS.ISO}** ${recipe.iso}${recipe.pushPull !== 0 ? ` ${RECIPE_STRINGS.DETAIL.DETAILS.PUSH_PULL(recipe.pushPull)}` : ""}
- **${RECIPE_STRINGS.FORM.FIELDS.TEMPERATURE(RECIPE_STRINGS.FORM.TEMPERATURE_UNIT[tempUnit])}** ${RECIPE_STRINGS.DETAIL.DETAILS.TEMPERATURE(tempUnit === "C" ? recipe.steps[0].temperatureC : recipe.steps[0].temperatureF, RECIPE_STRINGS.FORM.TEMPERATURE_UNIT[tempUnit])}
- **${RECIPE_STRINGS.FORM.FIELDS.DURATION}:** ${RECIPE_STRINGS.DETAIL.DETAILS.DURATION(Math.round(recipe.steps[0].duration / 60))}

## ${RECIPE_STRINGS.DETAIL.SECTIONS.PROCESS}
${
  recipe.steps[0].notes
    ? `### ${RECIPE_STRINGS.DETAIL.SECTIONS.AGITATION}
  ${recipe.steps[0].notes}
  `
    : ""
}
${
  recipe.notes
    ? `### ${RECIPE_STRINGS.DETAIL.SECTIONS.ADDITIONAL_NOTES}
  ${recipe.notes}`
    : ""
}

${recipe.source === "filmdev" ? `---\n*${RECIPE_STRINGS.DETAIL.SOURCE.FILMDEV}*` : ""}
`;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={RECIPE_STRINGS.DETAIL.TITLE(recipe.filmName, recipe.developerName)}
      actions={
        <ActionPanel>
          <Action
            title={RECIPE_STRINGS.COMMON.EDIT}
            icon={Icon.Pencil}
            onAction={() => push(<RecipeForm recipe={recipe} onSave={(r) => handleSaveRecipe(r, revalidate)} />)}
          />
          <Action
            title={RECIPE_STRINGS.COMMON.DELETE}
            icon={Icon.Trash}
            style={Action.Style.Destructive}
            onAction={async () => {
              await handleDeleteRecipe(recipe.id, revalidate);
              pop();
            }}
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
  );
}
