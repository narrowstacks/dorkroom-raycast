import { Icon, Keyboard } from "@raycast/api";

export interface KeyFeature {
  _id: string;
  feature: string;
}

interface DevelopmentLink {
  title: string;
  url: string;
  shortcut: {
    modifiers: Keyboard.KeyModifier[];
    key: Keyboard.KeyEquivalent;
  };
}

export interface FilmActions {
  favorite: {
    title: string;
    onAction: () => void;
    icon: Icon;
    shortcut: {
      modifiers: Keyboard.KeyModifier[];
      key: Keyboard.KeyEquivalent;
    };
  };
  bhPhoto: {
    title: string;
    url: string;
    shortcut: {
      modifiers: Keyboard.KeyModifier[];
      key: Keyboard.KeyEquivalent;
    };
  };
  development: {
    massiveDev: DevelopmentLink | null;
    filmDev: DevelopmentLink | null;
  } | null;
}

export interface Film {
  _id: string;
  brand: string;
  name: string;
  iso: number;
  formatThirtyFive: boolean;
  formatOneTwenty: boolean;
  color: boolean;
  process: string;
  staticImageUrl: string;
  description: string;
  customDescription: string[];
  keyFeatures: KeyFeature[];
  dateAdded: string;
  searchBrand?: string;
  searchName?: string;
}
