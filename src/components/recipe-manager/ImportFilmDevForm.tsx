import { ActionPanel, Action, showToast, Toast, Form, useNavigation } from "@raycast/api";
import { importFilmDevRecipe } from "../../lib/recipes";
import { RECIPE_STRINGS } from "../../constants/strings";

interface ImportFilmDevFormProps {
  onImport: () => void;
}

export function ImportFilmDevForm({ onImport }: ImportFilmDevFormProps) {
  const { pop } = useNavigation();

  async function handleSubmit(values: { recipeId: string }) {
    try {
      await importFilmDevRecipe(values.recipeId);
      await showToast({ title: RECIPE_STRINGS.FORM.SUCCESS.IMPORT, style: Toast.Style.Success });
      onImport();
      pop();
    } catch (error) {
      await showToast({
        title: RECIPE_STRINGS.FORM.ERROR.IMPORT,
        message: error instanceof Error ? error.message : "Unknown error",
        style: Toast.Style.Failure,
      });
    }
  }

  return (
    <Form
      navigationTitle={RECIPE_STRINGS.COMMON.IMPORT}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={RECIPE_STRINGS.COMMON.IMPORT} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="recipeId"
        title={RECIPE_STRINGS.IMPORT.FILMDEV_ID}
        placeholder={RECIPE_STRINGS.IMPORT.ID_PLACEHOLDER}
      />
    </Form>
  );
}
