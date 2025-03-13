export interface DevelopmentStep {
  name: string;
  duration: number; // in seconds
  temperatureC: number;
  temperatureF: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  filmId: string;
  filmName: string;
  developerId: string;
  developerName: string;
  dilution: string;
  iso: number;
  pushPull: number; // 0 for normal, positive for push, negative for pull
  steps: DevelopmentStep[];
  notes?: string;
  source: "filmdev" | "user";
  filmdevId?: string; // Only present if imported from filmdev.org
  dateAdded: string;
  lastModified: string;
}

export interface FilmDevRecipe {
  id: number;
  duration_hours: number;
  duration_minutes: number;
  duration_seconds: number;
  notes: string;
  recipe_link: string;
  recipe_name: string;
  developer: string;
  dilution_ratio: string;
  film: string;
  created: string;
  celcius: string;
  fahrenheit: string;
  user: string;
  profile_link: string;
  photos_link: string;
  format: string | null;
}

export interface FilmDevResponse {
  recipe: FilmDevRecipe;
} 