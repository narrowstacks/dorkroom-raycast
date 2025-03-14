import { getPreferenceValues, Icon, KeyModifier, Keyboard } from "@raycast/api"
import { Film } from "../types/film"
import { generateBHPhotoUrl, generateMassiveDevChartUrl, generateFilmDevUrls } from "../lib/urls"
import { FILM_STRINGS } from "../constants/strings"
import { usePreferredDeveloper } from "./usePreferredDeveloper"

interface FilmActionsConfig {
  film: Film
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack?: () => void
}

interface Preferences {
  tempUnit: "C" | "F"
}

export function useFilmActions({ film, isFavorite, onToggleFavorite, onBack }: FilmActionsConfig) {
  const { tempUnit } = getPreferenceValues<Preferences>()
  const { preferredDeveloper } = usePreferredDeveloper()

  // Generate all URLs
  const bhPhotoUrl = generateBHPhotoUrl(film)
  const massiveDevChartUrl = generateMassiveDevChartUrl(film, { tempUnit, preferredDeveloper })
  const { showUrl: filmDevShowUrl, searchUrl: filmDevSearchUrl } = generateFilmDevUrls(film, {
    tempUnit,
    preferredDeveloper,
  })

  // Common metadata fields
  const commonMetadata = {
    brand: film.brand,
    name: film.name,
    iso: film.iso.toString(),
    process: film.process,
    type: film.color ? "Color" : "Black & White",
    formats: [
      film.formatThirtyFive && "35mm",
      film.formatOneTwenty && "120"
    ].filter(Boolean).join(", "),
    keyFeatures: film.keyFeatures,
    customDescription: film.customDescription,
  }

  // Common actions
  const commonActions = {
    favorite: {
      title: isFavorite ? FILM_STRINGS.FAVORITES.REMOVE : FILM_STRINGS.FAVORITES.ADD,
      onAction: onToggleFavorite,
      icon: isFavorite ? Icon.StarDisabled : Icon.Star,
      shortcut: { modifiers: ["cmd" as KeyModifier], key: "f" as Keyboard.KeyEquivalent },
    },
    bhPhoto: {
      title: `${film.brand} ${film.name}`,
      url: bhPhotoUrl,
      shortcut: { modifiers: ["cmd" as KeyModifier], key: "b" as Keyboard.KeyEquivalent },
    },
  }

  // Development-specific actions (for B&W films)
  const developmentActions = !film.color
    ? {
        massiveDev: massiveDevChartUrl
          ? {
              title: preferredDeveloper 
                ? `View Times for ${preferredDeveloper.replace(/%/g, "")}`
                : "View Development Times",
              url: massiveDevChartUrl,
              shortcut: { modifiers: ["cmd" as KeyModifier], key: "d" as Keyboard.KeyEquivalent },
            }
          : null,
        filmDev: filmDevSearchUrl
          ? {
              title: preferredDeveloper
                ? `View Recipes for ${preferredDeveloper.replace(/%/g, "")}`
                : "View Development Recipes",
              url: filmDevSearchUrl,
              shortcut: { modifiers: ["cmd" as KeyModifier], key: "r" as Keyboard.KeyEquivalent },
            }
          : null,
      }
    : null

  return {
    urls: {
      bhPhotoUrl,
      massiveDevChartUrl,
      filmDevShowUrl,
      filmDevSearchUrl,
    },
    metadata: commonMetadata,
    actions: {
      ...commonActions,
      development: developmentActions,
    },
    preferences: {
      tempUnit,
      preferredDeveloper,
    },
  }
} 