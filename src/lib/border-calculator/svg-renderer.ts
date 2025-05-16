import fs from "fs";
import path from "path";
import { BorderCalculation, BorderTemplate } from "./types";
import { environment } from "@raycast/api";

interface SvgOptions {
  width: number;
  height: number;
  padding: number;
  backgroundColor: string;
  borderColor: string;
  printColor: string;
  textColor: string;
  infoTextColor: string;
  strokeWidth: number;
}

const DEFAULT_OPTIONS: SvgOptions = {
  width: 800,
  height: 600,
  padding: 40,
  backgroundColor: "#ffffff",
  borderColor: "#e0e0e0",
  printColor: "#f8f8f8",
  textColor: "#333333",
  infoTextColor: "#FFFFFF",
  strokeWidth: 2,
};

/**
 * Generates an SVG representation of a border template calculation
 */
export function generateSvg(
  calculation: BorderCalculation,
  template: BorderTemplate,
  options: Partial<SvgOptions> = {},
): string {
  const opts: SvgOptions = { ...DEFAULT_OPTIONS, ...options };
  const { width, height, padding, backgroundColor, borderColor, printColor, textColor, strokeWidth } = opts;

  // Get easel dimensions and scale to fit within the SVG bounds
  const easelWidth = calculation.easel.size.width;
  const easelHeight = calculation.easel.size.height;

  // Calculate scale factor to fit the easel within the SVG
  const easelAspectRatio = easelWidth / easelHeight;
  const svgAspectRatio = (width - 2 * padding) / (height - 2 * padding);

  let scale: number;
  if (easelAspectRatio > svgAspectRatio) {
    // Scale based on width
    scale = (width - 2 * padding) / easelWidth;
  } else {
    // Scale based on height
    scale = (height - 2 * padding) / easelHeight;
  }

  // Calculate print area dimensions
  const printWidth = calculation.printDimensions.width * scale;
  const printHeight = calculation.printDimensions.height * scale;

  // Determine paper dimensions after scaling
  const paperWidth = template.paperDimensions.width * scale;
  const paperHeight = template.paperDimensions.height * scale;

  // Calculate the centered position of the paper in the SVG
  const paperX = (width - paperWidth) / 2;
  const paperY = (height - paperHeight) / 2;

  // Calculate the print area position
  const printX = paperX + calculation.borders.left * scale;
  const printY = paperY + calculation.borders.top * scale;

  // Generate the SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      
      <!-- Paper -->
      <rect 
        x="${paperX}" 
        y="${paperY}" 
        width="${paperWidth}" 
        height="${paperHeight}" 
        fill="${borderColor}" 
        stroke="#888888" 
        stroke-width="${strokeWidth}" 
      />
      
      <!-- Print area -->
      <rect 
        x="${printX}" 
        y="${printY}" 
        width="${printWidth}" 
        height="${printHeight}" 
        fill="${printColor}" 
        stroke="#555555" 
        stroke-width="${strokeWidth}" 
      />
      
      <!-- Labels -->
      <text 
        x="${width / 2}" 
        y="${height - padding / 2}" 
        text-anchor="middle" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
      >
        Paper: ${template.paperDimensions.width}" × ${template.paperDimensions.height}"
      </text>
      
      <!-- Measurements -->
      <text 
        x="${printX + printWidth / 2}" 
        y="${printY - 10}" 
        text-anchor="middle" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
      >
        ${calculation.borders.top.toFixed(2)}"
      </text>
      
      <text 
        x="${printX + printWidth / 2}" 
        y="${printY + printHeight + 20}" 
        text-anchor="middle" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
      >
        ${calculation.borders.bottom.toFixed(2)}"
      </text>
      
      <text 
        x="${printX - 10}" 
        y="${printY + printHeight / 2}" 
        text-anchor="end" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
      >
        ${calculation.borders.left.toFixed(2)}"
      </text>
      
      <text 
        x="${printX + printWidth + 10}" 
        y="${printY + printHeight / 2}" 
        text-anchor="start" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
      >
        ${calculation.borders.right.toFixed(2)}"
      </text>
      
      <!-- Print dimensions -->
      <text 
        x="${printX + printWidth / 2}" 
        y="${printY + printHeight / 2}" 
        text-anchor="middle" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="24"
        font-weight="bold"
      >
        ${calculation.printDimensions.width.toFixed(2)}" × ${calculation.printDimensions.height.toFixed(2)}"
      </text>
    </svg>
  `.trim();

  return svg;
}

/**
 * Convert SVG to a data URL that can be used directly in Markdown
 */
export function svgToDataUrl(svgString: string): string {
  // Encode the SVG as a base64 data URL
  const svgBase64 = Buffer.from(svgString).toString("base64");
  return `data:image/svg+xml;base64,${svgBase64}`;
}

/**
 * Generates an image data URL for a border template
 */
export function generateTemplateImageUrl(template: BorderTemplate, calculation: BorderCalculation): string {
  // Generate SVG
  const svg = generateSvg(calculation, template);

  // Convert to data URL
  return svgToDataUrl(svg);
}

/**
 * Gets the cache directory for storing template data
 */
export function getCacheDirectory(): string {
  const cacheDir = path.join(environment.supportPath, "border-templates");

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create cache directory:", error);
    }
  }

  return cacheDir;
}

/**
 * Gets the image cache path for a template
 */
export function getTemplateImageCachePath(templateId: string): string {
  return path.join(getCacheDirectory(), `${templateId}.svg`);
}

/**
 * Checks if an image already exists in cache for a template
 */
export function templateImageExists(templateId: string): boolean {
  const cachePath = getTemplateImageCachePath(templateId);
  return fs.existsSync(cachePath);
}

/**
 * Saves an SVG for a template to the cache
 */
export async function saveTemplateImage(template: BorderTemplate, calculation: BorderCalculation): Promise<string> {
  // Always generate a fresh SVG when saving to ensure it reflects the current state
  const svg = generateSvg(calculation, template);
  const cachePath = getTemplateImageCachePath(template.id);

  try {
    // Ensure cache directory exists
    const cacheDir = getCacheDirectory();
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Write SVG to file
    fs.writeFileSync(cachePath, svg);
    return svgToDataUrl(svg);
  } catch (error) {
    console.error(`Failed to save template image for "${template.name}":`, error);
    // Return data URL even if we failed to save to cache
    return svgToDataUrl(svg);
  }
}

/**
 * Gets the SVG data from cache or generates it
 */
export async function getTemplateImage(template: BorderTemplate, calculation: BorderCalculation): Promise<string> {
  // Always generate a fresh image to properly handle orientation changes
  return saveTemplateImage(template, calculation);
}

/**
 * Deletes the image file for a template
 */
export function deleteTemplateImage(templateId: string): boolean {
  try {
    const cachePath = getTemplateImageCachePath(templateId);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to delete template image for ID ${templateId}:`, error);
    return false;
  }
}
