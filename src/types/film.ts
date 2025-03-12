export interface KeyFeature {
  _id: string;
  feature: string;
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