/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Quality check types for document validation
 */

export enum QualityCheckType {
  BRIGHTNESS = "brightness",
  BLUR = "blur",
  RESOLUTION = "resolution",
  ORIENTATION = "orientation",
}

/**
 * Quality check thresholds
 */
export const QUALITY_THRESHOLDS = {
  [QualityCheckType.BRIGHTNESS]: {
    min: 50,
    max: 200,
    description: "Average brightness should be between 50-200",
  },
  [QualityCheckType.BLUR]: {
    min: 100,
    description: "Laplacian variance should be > 100 (higher = sharper)",
  },
  [QualityCheckType.RESOLUTION]: {
    minWidth: 600,
    minHeight: 600,
    description: "Minimum resolution should be 600x600 pixels",
  },
  [QualityCheckType.ORIENTATION]: {
    expected: 1,
    description: "Image should be in normal orientation (EXIF orientation = 1)",
  },
};
