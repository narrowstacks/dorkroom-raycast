import { BorderTemplate, BorderCalculation, EaselSize, STANDARD_EASEL_SIZES } from "./types";

interface AvailableArea {
  width: number;
  height: number;
}

function calculateAvailableArea(template: BorderTemplate): AvailableArea {
  const { paperDimensions, minimumBorder } = template;
  return {
    width: paperDimensions.width - 2 * minimumBorder,
    height: paperDimensions.height - 2 * minimumBorder,
  };
}

function calculatePrintDimensions(template: BorderTemplate, availableArea: AvailableArea) {
  const { aspectRatio } = template;
  const availableRatio = availableArea.width / availableArea.height;
  const desiredRatio = aspectRatio.width / aspectRatio.height;

  // If available ratio > desired ratio, height is limiting factor
  if (availableRatio > desiredRatio) {
    return {
      height: availableArea.height,
      width: availableArea.height * desiredRatio,
    };
  }

  // Otherwise width is limiting factor
  return {
    width: availableArea.width,
    height: availableArea.width / desiredRatio,
  };
}

function calculateBorders(template: BorderTemplate, printDimensions: { width: number; height: number }) {
  const { paperDimensions, horizontalOffset, verticalOffset } = template;

  // Calculate base borders
  const baseHorizontal = (paperDimensions.width - printDimensions.width) / 2;
  const baseVertical = (paperDimensions.height - printDimensions.height) / 2;

  return {
    left: baseHorizontal + horizontalOffset,
    right: baseHorizontal - horizontalOffset,
    top: baseVertical + verticalOffset,
    bottom: baseVertical - verticalOffset,
  };
}

function determineEaselSize(paperDimensions: { width: number; height: number }): EaselSize {
  // Try both orientations of the paper
  const paperMax = Math.max(paperDimensions.width, paperDimensions.height);
  const paperMin = Math.min(paperDimensions.width, paperDimensions.height);

  // Find the smallest easel that can accommodate the paper in either orientation
  const suitableEasel = STANDARD_EASEL_SIZES.find((easel) => {
    const easelMax = Math.max(easel.width, easel.height);
    const easelMin = Math.min(easel.width, easel.height);
    return easelMax >= paperMax && easelMin >= paperMin;
  });

  // If no suitable easel found, return the largest standard size
  return suitableEasel || STANDARD_EASEL_SIZES[STANDARD_EASEL_SIZES.length - 1];
}

function calculateEaselOffsets(
  paperDimensions: { width: number; height: number },
  easelSize: EaselSize,
): { width: number; height: number } {
  // Calculate the maximum offsets in both orientations
  const paperLandscape = paperDimensions.width > paperDimensions.height;
  const easelLandscape = easelSize.width > easelSize.height;

  // If orientations match, use direct subtraction
  if (paperLandscape === easelLandscape) {
    return {
      width: Math.max(0, easelSize.width - paperDimensions.width),
      height: Math.max(0, easelSize.height - paperDimensions.height),
    };
  }

  // If orientations don't match, swap easel dimensions
  return {
    width: Math.max(0, easelSize.height - paperDimensions.width),
    height: Math.max(0, easelSize.width - paperDimensions.height),
  };
}

function calculateBladePositions(
  printDimensions: { width: number; height: number },
  borders: { left: number; right: number; top: number; bottom: number },
  easelOffsets: { width: number; height: number },
) {
  // Add easel offsets to blade positions
  const offsetWidth = easelOffsets.width / 2;
  const offsetHeight = easelOffsets.height / 2;

  return {
    left: printDimensions.width + borders.left - borders.right + offsetWidth,
    right: printDimensions.width - borders.left + borders.right + offsetWidth,
    top: printDimensions.height + borders.top - borders.bottom + offsetHeight,
    bottom: printDimensions.height - borders.top + borders.bottom + offsetHeight,
  };
}

function validateCalculation(
  template: BorderTemplate,
  borders: { left: number; right: number; top: number; bottom: number },
  bladePositions: { left: number; right: number; top: number; bottom: number },
  easelSize: EaselSize,
): string[] {
  const warnings: string[] = [];

  // Check for negative borders
  if (borders.left < 0) warnings.push("Left border is negative");
  if (borders.right < 0) warnings.push("Right border is negative");
  if (borders.top < 0) warnings.push("Top border is negative");
  if (borders.bottom < 0) warnings.push("Bottom border is negative");

  // Check for blade positions below 3 inches (typical easel minimum)
  if (bladePositions.left < 3) warnings.push("Left blade position is below 3 inches");
  if (bladePositions.right < 3) warnings.push("Right blade position is below 3 inches");
  if (bladePositions.top < 3) warnings.push("Top blade position is below 3 inches");
  if (bladePositions.bottom < 3) warnings.push("Bottom blade position is below 3 inches");

  // Check if minimum border is too large
  const maxBorder = Math.min(template.paperDimensions.width, template.paperDimensions.height) / 2;
  if (template.minimumBorder >= maxBorder) {
    warnings.push("Minimum border is too large for paper size");
  }

  // Check if paper size exceeds easel size
  const paperMax = Math.max(template.paperDimensions.width, template.paperDimensions.height);
  const paperMin = Math.min(template.paperDimensions.width, template.paperDimensions.height);
  const easelMax = Math.max(easelSize.width, easelSize.height);
  const easelMin = Math.min(easelSize.width, easelSize.height);

  if (paperMax > easelMax || paperMin > easelMin) {
    warnings.push(`Paper size exceeds maximum easel size (${easelSize.name})`);
  }

  return warnings;
}

export function calculateBorderTemplate(template: BorderTemplate): BorderCalculation {
  // Calculate available area after minimum borders
  const availableArea = calculateAvailableArea(template);

  // Calculate print dimensions based on aspect ratio
  const printDimensions = calculatePrintDimensions(template, availableArea);

  // Calculate borders with offsets
  const borders = calculateBorders(template, printDimensions);

  // Determine easel size and calculate offsets
  const easelSize = determineEaselSize(template.paperDimensions);
  const easelOffsets = calculateEaselOffsets(template.paperDimensions, easelSize);

  // Calculate blade positions with easel offsets
  const bladePositions = calculateBladePositions(printDimensions, borders, easelOffsets);

  // Validate and generate warnings
  const warnings = validateCalculation(template, borders, bladePositions, easelSize);

  return {
    printDimensions,
    borders,
    bladePositions,
    easel: {
      size: easelSize,
      offsets: easelOffsets,
    },
    warnings,
  };
}
