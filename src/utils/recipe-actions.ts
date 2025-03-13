import { confirmAlert, showToast, Toast } from "@raycast/api";
import { deleteRecipe, saveRecipe } from "../lib/recipes";
import { Recipe } from "../types/recipe";
import { RECIPE_STRINGS } from "../constants/strings";

/**
 * Saves a recipe and triggers a revalidation
 * @param recipe The recipe to save
 * @param revalidate Function to trigger revalidation of recipes
 */
export async function handleSaveRecipe(recipe: Recipe, revalidate: () => void) {
  await saveRecipe(recipe);
  revalidate();
}

/**
 * Deletes a recipe after confirmation and triggers a revalidation
 * @param recipeId The ID of the recipe to delete
 * @param revalidate Function to trigger revalidation of recipes
 * @returns True if the recipe was deleted, false otherwise
 */
export async function handleDeleteRecipe(recipeId: string, revalidate: () => void) {
  if (
    await confirmAlert({
      title: RECIPE_STRINGS.COMMON.DELETE_CONFIRM.TITLE,
      message: RECIPE_STRINGS.COMMON.DELETE_CONFIRM.MESSAGE,
      primaryAction: { title: RECIPE_STRINGS.COMMON.DELETE_CONFIRM.ACTION },
    })
  ) {
    await deleteRecipe(recipeId);
    revalidate();
    await showToast({ title: RECIPE_STRINGS.FORM.SUCCESS.DELETE, style: Toast.Style.Success });
    return true;
  }
  return false;
} 