import Fuse from 'fuse.js'
import { Film } from '../types/film'
import nameMappings from '../data/name-mappings.json'

// Type guard for checking if a key exists in an object
function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

// Helper function to capitalize first letter of each word while respecting existing mappings
function toTitleCase(text: string, mappings: Record<string, string>): string {
  // First check if there's an exact mapping (case-insensitive)
  const lowerText = text.toLowerCase()
  if (Object.keys(mappings).some(key => key.toLowerCase() === lowerText)) {
    return text // Keep original case as it will be mapped later
  }

  // Otherwise apply title case, treating hyphens as word boundaries
  return text.toLowerCase().replace(/(?:^|\s|-)\w/g, letter => letter.toUpperCase())
}

export function normalizeNames(film: Film): Film {
  const brandMappings = nameMappings.brands
  const filmMappings = nameMappings.films
  const genericReplacements = nameMappings['generic-replacements']

  // Helper function to apply generic replacements
  function applyGenericReplacements(text: string): string {
    let result = text
    for (const [pattern, replacement] of Object.entries(genericReplacements)) {
      const regex = new RegExp(pattern, 'gi')
      result = result.replace(regex, replacement)
    }
    // Clean up any extra spaces that might be created by empty replacements
    return result.replace(/\s+/g, ' ').trim()
  }

  // Store original values for search
  const searchBrand = film.brand
  const searchName = film.name

  // Normalize brand name for display
  const normalizedBrand = film.brand.toLowerCase()
  let properBrand = hasKey(brandMappings, normalizedBrand) ? brandMappings[normalizedBrand] : toTitleCase(film.brand, brandMappings)
  properBrand = applyGenericReplacements(properBrand)

  // Normalize film name for display
  const normalizedName = film.name.toLowerCase()
  let properName = hasKey(filmMappings, normalizedName) ? filmMappings[normalizedName] : toTitleCase(film.name, filmMappings)
  properName = applyGenericReplacements(properName)

  // Create a new object with all the original properties
  const normalizedFilm = {
    ...film,
    brand: properBrand,
    name: properName,
    searchBrand: searchBrand,
    searchName: searchName,
  }

  return normalizedFilm
}

export function createFuseInstance(films: Film[]) {
  const options = {
    keys: ['searchName', 'searchBrand', 'type', 'process'],
    threshold: 0.3,
    ignoreLocation: true,
    useExtendedSearch: true,
  }

  return new Fuse(films, options)
}

export function fuzzySearchFilms(films: Film[], searchText: string): Film[] {
  if (!searchText) return films

  const fuse = createFuseInstance(films)
  const results = fuse.search(searchText)
  return results.map((result) => result.item)
} 