import { DilutionResult } from "../types/dilution";

export function parseRatioString(ratio: string): number[] | null {
  // Handle single number input (assumes 1:n ratio)
  if (/^\d+$/.test(ratio)) {
    return [1, parseInt(ratio)];
  }

  // Handle both "+" and ":" formats
  let parts: string[];
  if (ratio.includes("+")) {
    parts = ratio.split("+");
  } else if (ratio.includes(":")) {
    parts = ratio.split(":");
  } else {
    return null;
  }

  // Convert parts to numbers and validate
  const numbers = parts.map((part) => parseInt(part.trim()));
  if (numbers.some(isNaN) || numbers.length < 2 || numbers.length > 3) {
    return null;
  }

  return numbers;
}

export function calculateDilution(ratio: string, amount: number): DilutionResult | null {
  const parts = parseRatioString(ratio);
  if (!parts) return null;

  const isColonNotation = ratio.includes(":");
  let volumes: number[];

  if (isColonNotation) {
    // For colon notation (1:31), the total is the second number (or sum of last two for triple)
    if (parts.length === 2) {
      // For 1:31, chemical is (1/31) of total amount
      const chemical = Number(((amount * parts[0]) / parts[1]).toFixed(2));
      volumes = [chemical, amount - chemical];
    } else {
      // For 1:1:100, first two chemicals split the first part, water is the rest
      const total = parts[2];
      const chemicalAPortion = parts[0] / total;
      const chemicalBPortion = parts[1] / total;
      volumes = [
        Number((amount * chemicalAPortion).toFixed(2)),
        Number((amount * chemicalBPortion).toFixed(2)),
        Number((amount * (1 - chemicalAPortion - chemicalBPortion)).toFixed(2)),
      ];
    }
  } else {
    // For plus notation (1+31), total is sum of all parts
    const total = parts.reduce((sum, part) => sum + part, 0);
    volumes = parts.map((part) => Number(((amount * part) / total).toFixed(2)));
  }

  // Generate appropriate labels based on number of parts
  let labels: string[];
  if (parts.length === 2) {
    labels = ["Chemical", "Water"];
  } else {
    labels = ["Chemical A", "Chemical B", "Water"];
  }

  return {
    ratio,
    amount,
    parts,
    volumes,
    labels,
  };
}

export function formatDilutionResult(
  result: DilutionResult,
  volumeUnit: string,
  chemicalNames?: { a: string; b?: string },
): string {
  return result.labels
    .map((label, i) => {
      let displayLabel = label;
      if (chemicalNames) {
        if (label === "Chemical" || label === "Chemical A") {
          displayLabel = chemicalNames.a || label;
        } else if (label === "Chemical B" && chemicalNames.b) {
          displayLabel = chemicalNames.b;
        }
      }
      return `${displayLabel}: ${result.volumes[i]}${volumeUnit}`;
    })
    .join(", ");
}

export function fuzzyMatch(text: string, query: string): boolean {
  text = text.toLowerCase();
  query = query.toLowerCase().replace(/[-\s]/g, "");

  let queryIndex = 0;
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === query.length;
}

export function parseSearch(text: string, defaultNotation: "plus" | "colon"): { ratio: string; amount: number } | null {
  // First try to match "ratio amount" pattern (e.g., "1+31 500" or "1:1:100 500")
  const fullMatch = text.match(/^([0-9]+[+:][0-9]+(?::[0-9]+)?)\s+([0-9]+)$/);
  if (fullMatch) {
    return {
      ratio: fullMatch[1],
      amount: parseInt(fullMatch[2]),
    };
  }

  // Try to match two numbers pattern (e.g., "31 500" -> "1+31 500" or "1:31 500")
  const twoNumbersMatch = text.match(/^([0-9]+)\s+([0-9]+)$/);
  if (twoNumbersMatch) {
    const separator = defaultNotation === "plus" ? "+" : ":";
    return {
      ratio: `1${separator}${twoNumbersMatch[1]}`,
      amount: parseInt(twoNumbersMatch[2]),
    };
  }

  // Then try to match just a ratio or single number
  const ratioMatch = text.match(/^([0-9]+(?:[+:][0-9]+)*|[0-9]+)$/);
  if (ratioMatch) {
    return { ratio: ratioMatch[1], amount: 0 };
  }

  return null;
} 