import { LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";

// Helper function to get favorites from local storage
async function getFavorites(): Promise<string[]> {
  try {
    const favorites = await LocalStorage.getItem<string>("favoriteFilms");
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
}

// Helper function to save favorites to local storage
async function saveFavorites(favorites: string[]) {
  try {
    await LocalStorage.setItem("favoriteFilms", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const toggleFavorite = async (filmId: string) => {
    const newFavorites = favorites.includes(filmId) ? favorites.filter((id) => id !== filmId) : [...favorites, filmId];

    await saveFavorites(newFavorites);
    setFavorites(newFavorites);
  };

  return {
    favorites,
    toggleFavorite,
  };
}
