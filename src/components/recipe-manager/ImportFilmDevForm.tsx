import { ActionPanel, Action, showToast, Toast, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { importFilmDevRecipe } from "../../lib/recipes";
import { RECIPE_STRINGS } from "../../constants/strings";

interface ImportFilmDevFormProps {
  onImport: () => void;
}

export function ImportFilmDevForm({ onImport }: ImportFilmDevFormProps) {
  const { pop } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { recipeId: string }) {
    if (!values.recipeId.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: RECIPE_STRINGS.FORM.ERROR.IMPORT,
        message: "Recipe ID is required",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Show loading toast
      const loadingToast = await showToast({
        style: Toast.Style.Animated,
        title: RECIPE_STRINGS.IMPORT.LOADING,
      });

      await importFilmDevRecipe(values.recipeId);

      // Hide loading toast and show success toast
      await loadingToast.hide();
      await showToast({ title: RECIPE_STRINGS.FORM.SUCCESS.IMPORT, style: Toast.Style.Success });

      onImport();
      pop();
    } catch (error) {
      await showToast({
        title: RECIPE_STRINGS.FORM.ERROR.IMPORT,
        message: error instanceof Error ? error.message : "Unknown error",
        style: Toast.Style.Failure,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      navigationTitle={RECIPE_STRINGS.COMMON.IMPORT}
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={RECIPE_STRINGS.COMMON.IMPORT} onSubmit={handleSubmit} />
          <Action
            title={RECIPE_STRINGS.COMMON.CANCEL}
            onAction={pop}
            shortcut={{ modifiers: ["cmd"], key: "escape" }}
          />
        </ActionPanel>
      }
    >
      <Form.Description
        text={isLoading ? RECIPE_STRINGS.IMPORT.LOADING_DESCRIPTION : RECIPE_STRINGS.IMPORT.DESCRIPTION}
      />
      <Form.TextField
        id="recipeId"
        title={RECIPE_STRINGS.IMPORT.FILMDEV_ID}
        placeholder={RECIPE_STRINGS.IMPORT.ID_PLACEHOLDER}
      />
    </Form>
  );
}
