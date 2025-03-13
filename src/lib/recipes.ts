import { LocalStorage } from "@raycast/api";
import { Recipe, FilmDevRecipe, FilmDevResponse } from "../types/recipe";
import got from "got";
import filmdevCodes from "../data/filmdev_codes.json";
import { fetchFilmDevImages } from "../utils/recipe-actions";

const RECIPES_STORAGE_KEY = "film_recipes";
const FILMDEV_API_BASE = "https://filmdev.org/api/recipe";

// Helper function to convert between C and F
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

// Helper function to extract ISO from film name
function extractISOFromFilm(filmName: string): number {
  const isoMatch = filmName.match(/\b(\d{2,4})\b/);
  return isoMatch ? parseInt(isoMatch[1]) : 400; // Default to 400 if no ISO found
}

// Helper function to convert filmdev.org recipe to our format
function convertFilmDevRecipe(recipe: FilmDevRecipe): Recipe {
  // Calculate total duration in seconds
  const totalDuration = 
    recipe.duration_hours * 3600 + 
    recipe.duration_minutes * 60 + 
    recipe.duration_seconds;

  // Extract temperatures
  const temperatureC = parseFloat(recipe.celcius);
  const temperatureF = parseFloat(recipe.fahrenheit);

  return {
    id: `filmdev_${recipe.id}`,
    filmId: "",
    filmName: recipe.film,
    developerId: "",
    developerName: recipe.developer,
    dilution: recipe.dilution_ratio,
    iso: extractISOFromFilm(recipe.film),
    pushPull: 0, // FilmDev API doesn't provide push/pull info
    steps: [
      {
        name: "Development",
        duration: totalDuration,
        temperatureC,
        temperatureF,
        notes: recipe.notes,
      },
    ],
    notes: ` Recipe by: ${recipe.user}\nCreated: ${recipe.created}${recipe.format ? `\nFormat: ${recipe.format}` : ""}`,
    source: "filmdev",
    filmdevId: recipe.id.toString(),
    dateAdded: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
}

// Get all saved recipes
export async function getSavedRecipes(): Promise<Recipe[]> {
  const recipesJson = await LocalStorage.getItem<string>(RECIPES_STORAGE_KEY);
  return recipesJson ? JSON.parse(recipesJson) : [];
}

// Save a new recipe
export async function saveRecipe(recipe: Recipe): Promise<void> {
  const recipes = await getSavedRecipes();
  const existingIndex = recipes.findIndex((r) => r.id === recipe.id);

  if (existingIndex >= 0) {
    recipes[existingIndex] = {
      ...recipe,
      lastModified: new Date().toISOString(),
    };
  } else {
    recipes.push({
      ...recipe,
      dateAdded: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
  }

  await LocalStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
}

// Delete a recipe
export async function deleteRecipe(recipeId: string): Promise<void> {
  const recipes = await getSavedRecipes();
  const filteredRecipes = recipes.filter((r) => r.id !== recipeId);
  await LocalStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(filteredRecipes));
}

// Import a recipe from filmdev.org
export async function importFilmDevRecipe(recipeId: string): Promise<Recipe> {
  try {
    // Fetch recipe data from filmdev.org API
    const response = await got(`${FILMDEV_API_BASE}/${recipeId}`);
    const { recipe } = JSON.parse(response.body) as FilmDevResponse;
    const convertedRecipe = convertFilmDevRecipe(recipe);
    
    // Fetch images from filmdev.org if photos_link is available
    if (recipe.photos_link) {
      const imageUrls = await fetchFilmDevImages(recipe.photos_link);
      if (imageUrls.length > 0) {
        convertedRecipe.imageUrls = imageUrls;
      }
    }
    
    await saveRecipe(convertedRecipe);
    return convertedRecipe;
  } catch (error) {
    throw new Error(`Failed to import recipe: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Search recipes
export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const searchTerms = query.toLowerCase().split(" ");
  return recipes.filter((recipe) => {
    const searchableText = `${recipe.filmName} ${recipe.developerName} ${recipe.dilution} ${recipe.notes || ""}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });
} 