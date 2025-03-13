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

/**
 * Extracts image URLs from filmdev.org photos page
 * @param photosLink The URL to the photos page on filmdev.org
 * @returns An array of image URLs
 */
export async function fetchFilmDevImages(photosLink: string): Promise<string[]> {
  try {
    // If we don't have a photos link, return an empty array
    if (!photosLink) return [];
    
    // Show loading toast for image fetching
    const loadingToast = await showToast({
      style: Toast.Style.Animated,
      title: RECIPE_STRINGS.IMPORT.IMAGES.LOADING,
    });
    
    // Import got for HTTP requests
    const got = await import("got");
    
    // Fetch the photos page
    const response = await got.default(photosLink);
    const html = response.body;
    
    // Extract image URLs using regex
    // Look for img tags in the gallery section
    const regex = /<img[^>]+src="([^"]+)"[^>]*class="[^"]*gallery-image[^"]*"[^>]*>/g;
    const matches = html.matchAll(regex);
    
    // Extract and clean up the image URLs
    const imageUrls: string[] = [];
    for (const match of matches) {
      if (match[1]) {
        // Make sure we have absolute URLs
        const imageUrl = match[1].startsWith('http') ? match[1] : `https://filmdev.org${match[1]}`;
        imageUrls.push(imageUrl);
      }
    }
    
    // Hide the loading toast
    await loadingToast.hide();
    
    // Show success or info toast based on results
    if (imageUrls.length > 0) {
      await showToast({
        style: Toast.Style.Success,
        title: RECIPE_STRINGS.IMPORT.IMAGES.SUCCESS(imageUrls.length),
      });
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: RECIPE_STRINGS.IMPORT.IMAGES.NO_IMAGES,
      });
    }
    
    return imageUrls;
  } catch (error) {
    console.error("Failed to fetch filmdev images:", error);
    
    // Show error toast
    try {
      await showToast({
        style: Toast.Style.Failure,
        title: RECIPE_STRINGS.IMPORT.IMAGES.ERROR,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (toastError) {
      // Ignore toast errors
    }
    
    return [];
  }
} 