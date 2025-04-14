import { getPreferenceValues } from "@raycast/api";
import { useState } from "react";
import { useCachedPromise } from "@raycast/utils";
import { getSavedRecipes, searchRecipes } from "./lib/recipes";
import { RecipeList } from "./components/recipe-manager/RecipeList";

interface Preferences {
  tempUnit: "C" | "F";
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { data: recipes = [], revalidate } = useCachedPromise(getSavedRecipes);
  const { tempUnit } = getPreferenceValues<Preferences>();

  const filteredRecipes = searchText ? searchRecipes(recipes, searchText) : recipes;

  return (
    <RecipeList
      recipes={filteredRecipes}
      searchText={searchText}
      tempUnit={tempUnit}
      onSearchTextChange={setSearchText}
      revalidate={revalidate}
    />
  );
}
