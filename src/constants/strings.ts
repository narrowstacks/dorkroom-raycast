export const FILM_STRINGS = {
  DEVELOPMENT: {
    MASSIVE_DEV_CHART: {
      ALL_TIMES: "All Developing Times",
      DEVELOPER_TIMES: (developer: string) => `${developer.replace(/%/g, "")} Development Times`,
    },
    FILMDEV: {
      ALL_RECIPES: "All Developing Recipes",
      DEVELOPER_RECIPES: (developer: string) => `${developer.replace(/%/g, "")} Developing Recipes`,
    },
  },
  BH_PHOTO: {
    VIEW_PRODUCT: "View Product",
    VIEW_ON_BH: "View on B&H Photo",
  },
  FAVORITES: {
    ADD: "Add to Favorites",
    REMOVE: "Remove from Favorites",
  },
  METADATA: {
    BRAND: "Brand",
    NAME: "Name",
    ISO: "ISO",
    PROCESS: "Process",
    TYPE: "Type",
    FORMATS: "Formats",
    KEY_FEATURES: "Key Features",
    ADDITIONAL_NOTES: "Additional Notes",
  },
  ACTIONS: {
    VIEW_DETAILS: "View Details",
    BACK_TO_LIST: "Back to List",
    CLEAR_CACHE: "Clear Cache",
  },
  FILM_TYPE: {
    COLOR: "Color",
    BW: "B&W",
  },
}

export const RECIPE_STRINGS = {
  COMMON: {
    SAVE: "Save Recipe",
    CREATE: "Create Recipe",
    EDIT: "Edit Recipe",
    DELETE: "Delete Recipe",
    VIEW: "View Recipe",
    IMPORT: "Import Recipe",
    NEW: "New Recipe",
    DELETE_CONFIRM: {
      TITLE: "Delete Recipe",
      MESSAGE: "Are you sure you want to delete this recipe?",
      ACTION: "Delete",
    },
  },
  FORM: {
    TEMPERATURE_UNIT: {
      C: "°C",
      F: "°F",
    },
    FIELDS: {
      FILM: "Film",
      FILM_NAME: "Film Name",
      DEVELOPER: "Developer",
      DEVELOPER_NAME: "Developer Name",
      DILUTION: "Dilution",
      ISO: "ISO",
      PUSH_PULL: "Push/Pull (stops)",
      DURATION: "Development Time (minutes)",
      TEMPERATURE: (unit: string) => `Temperature (${unit})`,
      AGITATION: "Agitation",
      NOTES: "Additional Notes",
    },
    PLACEHOLDERS: {
      FILM_NAME: "e.g., Kodak Tri-X 400",
      DEVELOPER_NAME: "e.g., Kodak D-76",
      DILUTION: "e.g., 1+1 or 1:4",
      ISO: "e.g., 400",
      PUSH_PULL: "0 for normal, +1 for push, -1 for pull",
      DURATION: "e.g., 11",
      TEMPERATURE: (unit: string) => `e.g., ${unit === "°C" ? "20" : "68"}`,
      AGITATION: "e.g., Initial 30s, then 10s every minute",
      NOTES: "Any additional notes about the recipe",
    },
    CUSTOM: {
      FILM: "Enter Custom Film...",
      DEVELOPER: "Enter Custom Developer...",
      DILUTION: "Enter Custom Dilution...",
    },
    VALIDATION: {
      FILM_REQUIRED: "Film name is required",
      DEVELOPER_REQUIRED: "Developer name is required",
      DILUTION_REQUIRED: "Dilution is required",
      ISO_REQUIRED: "Valid ISO is required",
      DURATION_REQUIRED: "Valid development time is required",
      TEMPERATURE_REQUIRED: "Valid temperature is required",
      PUSH_PULL_REQUIRED: "Push/Pull value is required (use 0 for normal development)",
    },
    SUCCESS: {
      SAVE: "Recipe saved!",
      DELETE: "Recipe deleted!",
      IMPORT: "Recipe imported!",
    },
    ERROR: {
      IMPORT: "Failed to import recipe",
    },
  },
  LIST: {
    SEARCH_PLACEHOLDER: "Search recipes...",
    EMPTY: {
      TITLE: "No Recipes Found",
      WITH_SEARCH: "Try a different search term",
      NO_RECIPES: "Add your first development recipe",
    },
    SECTIONS: {
      ADD_RECIPE: "Add Recipe",
      CREATE_NEW: "Create New Recipe",
      IMPORT_FROM_FILMDEV: "Import from FilmDev.org",
    },
  },
  DETAIL: {
    TITLE: (film: string, developer: string) => `${film} in ${developer}`,
    SECTIONS: {
      DEVELOPMENT_DETAILS: "Development Details",
      PROCESS: "Process",
      AGITATION: "Agitation",
      ADDITIONAL_NOTES: "Additional Notes",
    },
    DETAILS: {
      DILUTION: "Dilution:",
      ISO: "ISO:",
      TEMPERATURE: (temp: number, unit: string) => `${temp}${unit}`,
      DURATION: (minutes: number) => `${minutes} minutes`,
      PUSH_PULL: (stops: number) => `(${stops > 0 ? "+" : ""}${stops} stops)`,
    },
    SOURCE: {
      FILMDEV: "Imported from FilmDev.org",
    },
  },
  IMPORT: {
    FILMDEV_ID: "FilmDev.org Recipe ID",
    ID_PLACEHOLDER: "Enter the recipe ID from filmdev.org",
  },
}; 