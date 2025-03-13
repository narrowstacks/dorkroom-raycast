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
    BW: "Black & White",
  },
} 