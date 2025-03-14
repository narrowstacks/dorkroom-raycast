import { Film } from "../types/film";
import Fuse from "fuse.js";
import { findMatchingFilm } from "./massive-dev-chart";

interface UrlGeneratorOptions {
  tempUnit: "C" | "F";
  preferredDeveloper?: string;
}

export function generateBHPhotoUrl(film: Film): string {
  return `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(`${film.brand} ${film.name} film`)}`;
}

export function generateMassiveDevChartUrl(film: Film, options: UrlGeneratorOptions): string | null {
  if (film.color) {
    return null;
  }

  const matchingFilm = findMatchingFilm(film.brand, film.name);
  if (!matchingFilm) {
    return null;
  }

  const developer = options.preferredDeveloper ? options.preferredDeveloper.replace(/%/g, "").replace(/ /g, "+") : "";

  // Convert spaces to plus signs in the film value, then encode
  const encodedFilm = encodeURIComponent(matchingFilm.value.replace(/ /g, "+")).replace(/%2B/g, "+");
  const encodedDeveloper = encodeURIComponent(developer).replace(/%2B/g, "+");

  return `https://www.digitaltruth.com/devchart.php?Film=${encodedFilm}&Developer=${encodedDeveloper}&mdc=Search&TempUnits=${options.tempUnit}&TimeUnits=T`;
}

export function generateFilmDevUrls(film: Film, options: UrlGeneratorOptions): { showUrl: string | null; searchUrl: string | null } {
  // Don't generate URLs for color films
  if (film.color) {
    return { showUrl: null, searchUrl: null };
  }

  // Generate the search URL with just the film name and developer if available
  let searchUrl = null;
  const searchTerms = [film.name];
  
  if (options.preferredDeveloper) {
    searchTerms.push(options.preferredDeveloper);
  }
  
  searchUrl = `https://filmdev.org/recipe/search?search=${searchTerms.map(term => term.replace(/ /g, "+")).join("+")}`;

  return { showUrl: null, searchUrl };
}