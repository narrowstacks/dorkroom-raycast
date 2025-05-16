export interface Preferences {
  volumeUnit: "ml" | "floz";
  defaultNotation: "plus" | "colon";
}

export interface DilutionRatio {
  id: string;
  ratio: string;
  amount: number;
  name?: string;
  icon?: string;
  chemicalNames?: {
    a: string;
    b?: string;
  };
}

export interface DilutionResult {
  ratio: string;
  amount: number;
  parts: number[];
  volumes: number[];
  labels: string[];
}

export interface Developer {
  name: string;
  brand: string;
  type: string;
  commonDilutions: {
    name: string;
    ratio: string;
    description: string;
  }[];
}
