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
    CANCEL: "Cancel",
    DELETE_CONFIRM: {
      TITLE: "Delete Recipe",
      MESSAGE: "Are you sure you want to delete this recipe?",
      ACTION: "Delete",
    },
  },
  FORM: {
    ERROR: {
      IMPORT: "Failed to Import Recipe",
    },
    SUCCESS: {
      IMPORT: "Recipe Imported Successfully",
      SAVE: "Recipe Saved Successfully",
      DELETE: "Recipe Deleted Successfully",
    },
    VALIDATION: {
      FILM_REQUIRED: "Film is required",
      DEVELOPER_REQUIRED: "Developer is required",
      DILUTION_REQUIRED: "Dilution is required",
      ISO_REQUIRED: "Valid ISO is required",
      DURATION_REQUIRED: "Valid duration is required",
      TEMPERATURE_REQUIRED: "Valid temperature is required",
      PUSH_PULL_REQUIRED: "Valid push/pull value is required",
    },
    FIELDS: {
      FILM: "Film",
      FILM_NAME: "Film Name",
      DEVELOPER: "Developer",
      DEVELOPER_NAME: "Developer Name",
      TEMPERATURE: (unit: string) => `Temperature (${unit})`,
      DURATION: "Duration",
      AGITATION: "Agitation",
      NOTES: "Notes",
      DILUTION: "Dilution",
      ISO: "ISO",
      PUSH_PULL: "Push/Pull",
    },
    PLACEHOLDERS: {
      FILM_NAME: "Enter film name",
      DEVELOPER_NAME: "Enter developer name",
      TEMPERATURE: (unit: string) => `Enter temperature in ${unit}`,
      AGITATION: "Optional: Enter agitation details",
      NOTES: "Optional: Enter additional notes",
      DILUTION: "Enter dilution ratio (e.g., 1+31, 1:1:100, etc)",
      ISO: "Enter ISO value (e.g., 100, 400, etc.)",
      PUSH_PULL: "Enter push/pull value (e.g., 0, +1, -1)",
      DURATION: "Enter duration in minutes",
    },
    CUSTOM: {
      FILM: "Custom Film",
      DEVELOPER: "Custom Developer",
      DILUTION: "Custom Dilution"
    },
    TEMPERATURE_UNIT: {
      C: "°C",
      F: "°F",
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
    LOADING: "Importing recipe from FilmDev.org...",
    DESCRIPTION: "Enter the recipe ID from filmdev.org to import a recipe.",
    LOADING_DESCRIPTION: "Please wait while we import the recipe...",
  },
};

export const DILUTION_CALCULATOR_STRINGS = {
  SECTIONS: {
    CREATE_CUSTOM: "Create Custom Dilution",
    DEVELOPER_DILUTIONS: "Developer Dilutions",
    DEVELOPER_DILUTIONS_FOUND: (count: number) => `${count} found`,
    CURRENT_CALCULATION: "Current Calculation",
    SAVED_CALCULATIONS: "Saved Calculations",
    SAVED_COUNT: (count: number) => `${count} saved`,
    MANUFACTURER_COMMON: "Manufacturer/Common Dilutions"
  },
  ACTIONS: {
    CALCULATE: "Calculate",
    NEW_CALCULATION: "New Calculation",
    USE_DILUTION: (name: string, ratio: string) => `Use ${name} (${ratio})`,
    VIEW_DEVELOPER_DETAILS: "View Developer Details",
    SET_PREFERRED_DEVELOPER: "Set as Preferred Developer",
    REMOVE_PREFERRED_DEVELOPER: "Remove as Preferred Developer",
    PREFERRED_TAG: "Preferred",
    EDIT: "Edit",
    DELETE: "Delete"
  },
  SEARCH: {
    PLACEHOLDER: "Search developers or enter ratio (e.g., 'HC-110', 'Dilution B', '1+31', '31 500')"
  },
  FORM: {
    FIELDS: {
      RATIO: "Ratio",
      TOTAL_AMOUNT: (unit: string) => `Total Amount (${unit})`,
      SAVE_AS: "Save as (optional)",
      NAME: "Name",
      FIRST_CHEMICAL: "First Chemical Name (optional)",
      SECOND_CHEMICAL: "Second Chemical Name (optional)",
      ICON: "Icon (optional)"
    },
    PLACEHOLDERS: {
      RATIO: "e.g., 1+31 or 1:1:100",
      TOTAL_AMOUNT: "e.g., 300",
      SAVE_AS: "e.g., DD-X 1+31 or Pyro 1:1:100",
      ICON: "Enter a Raycast icon name or emoji",
      FIRST_CHEMICAL: "e.g., Developer",
      SECOND_CHEMICAL: "e.g., Activator"
    },
    DESCRIPTIONS: {
      ICON: "You can use Raycast icons (e.g., 'beaker') or system emojis (e.g., '🧪')",
      CURRENT_DILUTION: "Current Dilution"
    },
    ACTIONS: {
      CALCULATE: "Calculate",
      SAVE: "Save Changes"
    },
    VALIDATION: {
      INVALID_AMOUNT: {
        TITLE: "Invalid amount",
        MESSAGE: "Please enter a valid number for the amount"
      },
      INVALID_RATIO: {
        TITLE: "Invalid ratio format",
        MESSAGE: "Please use format like '1+31' or '1:1:100'"
      }
    }
  }
} 