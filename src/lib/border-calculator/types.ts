export interface PaperDimensions {
  width: number;
  height: number;
}

export interface BorderTemplate {
  id: string;
  name: string;
  paperDimensions: PaperDimensions;
  aspectRatio: {
    width: number;
    height: number;
  };
  minimumBorder: number;
  horizontalOffset: number;
  verticalOffset: number;
  createdAt: number;
  updatedAt: number;
}

export interface BorderCalculation {
  printDimensions: {
    width: number;
    height: number;
  };
  borders: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  bladePositions: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  easel: {
    size: EaselSize;
    offsets: {
      width: number;
      height: number;
    };
  };
  warnings: string[];
}

export interface BorderPreferences {
  defaultPaperSize: PaperDimensions;
  defaultMinimumBorder: number;
  useMetric: boolean;
  snapToQuarter: boolean;
}

export const DEFAULT_PREFERENCES: BorderPreferences = {
  defaultPaperSize: { width: 8, height: 10 },
  defaultMinimumBorder: 0.75,
  useMetric: false,
  snapToQuarter: true,
};

// Standard easel sizes in inches
export interface EaselSize {
  name: string;
  width: number;
  height: number;
}

export const STANDARD_EASEL_SIZES: EaselSize[] = [
  { name: "5×7", width: 5, height: 7 },
  { name: "8×10", width: 8, height: 10 },
  { name: "11×14", width: 11, height: 14 },
  { name: "16×20", width: 16, height: 20 },
  { name: "20×24", width: 20, height: 24 },
];

// Common paper sizes in inches
export interface PaperSize {
  label: string;
  value: string;
  width: number;
  height: number;
}

export const PAPER_SIZES: PaperSize[] = [
  { label: "4×5", value: "4x5", width: 4, height: 5 },
  { label: "4×6 (postcard)", value: "4x6", width: 4, height: 6 },
  { label: "5×7", value: "5x7", width: 5, height: 7 },
  { label: "8×10", value: "8x10", width: 8, height: 10 },
  { label: "11×14", value: "11x14", width: 11, height: 14 },
  { label: "16×20", value: "16x20", width: 16, height: 20 },
  { label: "20×24", value: "20x24", width: 20, height: 24 },
  { label: "Custom", value: "custom", width: 0, height: 0 },
];

// Common aspect ratios
export interface AspectRatio {
  label: string;
  value: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { label: "3:2 (35mm standard frame, 6×9)", value: "3/2", width: 3, height: 2 },
  { label: "65:24 (XPan Pano)", value: "65/24", width: 65, height: 24 },
  { label: "6:4.5", value: "6/4.5", width: 6, height: 4.5 },
  { label: "1:1 (Square/6×6)", value: "1/1", width: 1, height: 1 },
  { label: "7:6 (6×7)", value: "7/6", width: 7, height: 6 },
  { label: "8:6 (6×8)", value: "8/6", width: 8, height: 6 },
  { label: "5:4 (4×5)", value: "5/4", width: 5, height: 4 },
  { label: "7:5 (5×7)", value: "7/5", width: 7, height: 5 },
  { label: "4:3", value: "4/3", width: 4, height: 3 },
  { label: "Custom", value: "custom", width: 0, height: 0 },
];

// UI Constants
export const BLADE_THICKNESS = 15;
