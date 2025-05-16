import { LocalStorage, showToast, Toast } from "@raycast/api";
import got from "got";
import localFilmsData from "../data/films.json";
import { Film } from "../types/film";

const CACHE_KEY = "films-data";
const CACHE_TIMESTAMP_KEY = "films-last-updated";
const API_URL = "https://filmapi.vercel.app/api/films";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function readLocalJson(): Promise<Film[]> {
  return localFilmsData;
}

async function fetchFilms(): Promise<Film[]> {
  try {
    const { body } = await got(API_URL);
    const response = JSON.parse(body) as Film[];
    await LocalStorage.setItem(CACHE_KEY, JSON.stringify(response));
    await LocalStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
    return response;
  } catch (error) {
    console.error("Error fetching films:", error);
    throw error;
  }
}

async function compareAndUpdateFilms(): Promise<Film[]> {
  try {
    const [localData, apiData] = await Promise.all([readLocalJson(), fetchFilms()]);

    // Compare data based on _id and dateAdded
    const hasChanges = apiData.some((apiFilm) => {
      const localFilm = localData.find((local) => local._id === apiFilm._id);
      return !localFilm || localFilm.dateAdded !== apiFilm.dateAdded;
    });

    if (hasChanges) {
      await LocalStorage.setItem(CACHE_KEY, JSON.stringify(apiData));
      await LocalStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
      return apiData;
    }

    return localData;
  } catch (error) {
    console.error("Error comparing and updating films:", error);
    return readLocalJson(); // Fallback to local data if API fails
  }
}

export async function getCachedFilms(): Promise<Film[]> {
  const lastUpdated = await LocalStorage.getItem(CACHE_TIMESTAMP_KEY);
  const now = Date.now();

  if (!lastUpdated || now - Number(lastUpdated) > CACHE_TTL) {
    return compareAndUpdateFilms();
  }

  const cachedData = await LocalStorage.getItem(CACHE_KEY);
  if (!cachedData) return [];

  try {
    return JSON.parse(cachedData as string);
  } catch (error) {
    console.error("Error parsing cached data:", error);
    return [];
  }
}

export async function clearCache() {
  await LocalStorage.removeItem(CACHE_KEY);
  await LocalStorage.removeItem(CACHE_TIMESTAMP_KEY);
  await showToast({
    style: Toast.Style.Success,
    title: "Cache cleared",
    message: "Film data will be refreshed on next load",
  });
}

export function filterFilms(films: Film[], searchText: string): Film[] {
  return films.filter(
    (film) =>
      `${film.brand} ${film.name}`.toLowerCase().includes(searchText.toLowerCase()) ||
      film.process.toLowerCase().includes(searchText.toLowerCase()) ||
      (film.color ? "color" : "black and white").includes(searchText.toLowerCase()),
  );
}
