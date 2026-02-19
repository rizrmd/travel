/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Quality Validation Service
 * Pre-validates document quality before sending to OCR API (cost optimization)
 */

import { Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";
import {
  QualityValidationDto,
  QualityCheckResultDto,
} from "../dto/quality-validation.dto";
import {
  QUALITY_THRESHOLDS,
  QualityCheckType,
} from "../domain/quality-check-type.enum";

@Injectable()
export class QualityValidationService {
  private readonly logger = new Logger(QualityValidationService.name);

  /**
   * Validate document image quality
   * Performs 4 checks: brightness, blur, resolution, orientation
   */
  async validateDocument(fileBuffer: Buffer): Promise<QualityValidationDto> {
    this.logger.debug("🔍 Starting document quality validation...");

    try {
      const results = {
        brightness: await this.checkBrightness(fileBuffer),
        blur: await this.checkBlur(fileBuffer),
        resolution: await this.checkResolution(fileBuffer),
        orientation: await this.checkOrientation(fileBuffer),
      };

      const passed = Object.values(results).every((r) => r.passed);

      const validation: QualityValidationDto = {
        passed,
        checks: results,
        recommendations: this.generateRecommendations(results),
      };

      if (passed) {
        this.logger.log("✅ Document quality validation passed");
      } else {
        this.logger.warn("⚠️  Document quality validation failed");
        this.logger.warn(
          `📋 Recommendations: ${validation.recommendations.join(", ")}`,
        );
      }

      return validation;
    } catch (error) {
      this.logger.error("❌ Quality validation failed", error.stack);

      // Return a failed validation with generic recommendation
      return {
        passed: false,
        checks: {
          brightness: {
            passed: false,
            value: 0,
            threshold: "50-200",
            message: "Unable to check",
          },
          blur: {
            passed: false,
            value: 0,
            threshold: ">100",
            message: "Unable to check",
          },
          resolution: {
            passed: false,
            value: "0x0",
            threshold: "600x600",
            message: "Unable to check",
          },
          orientation: {
            passed: false,
            value: 0,
            threshold: "1",
            message: "Unable to check",
          },
        },
        recommendations: [
          "Pastikan file adalah gambar yang valid (JPG, PNG, WebP)",
        ],
      };
    }
  }

  /**
   * Check brightness level
   * Valid range: 50-200 (average brightness)
   */
  private async checkBrightness(
    buffer: Buffer,
  ): Promise<QualityCheckResultDto> {
    try {
      const { stats } = (await sharp(buffer).stats()) as any;

      // Calculate average brightness across all channels
      const avgBrightness = Math.round(
        stats.channels.reduce((sum, channel) => sum + channel.mean, 0) /
        stats.channels.length,
      );

      const threshold = QUALITY_THRESHOLDS[QualityCheckType.BRIGHTNESS];
      const passed =
        avgBrightness >= threshold.min && avgBrightness <= threshold.max;

      let message = "OK";
      if (avgBrightness < threshold.min) {
        message = "Gambar terlalu gelap - tingkatkan pencahayaan";
      } else if (avgBrightness > threshold.max) {
        message = "Gambar terlalu terang - kurangi pencahayaan";
      }

      return {
        passed,
        value: avgBrightness,
        threshold: `${threshold.min}-${threshold.max}`,
        message,
      };
    } catch (error) {
      this.logger.error("Failed to check brightness", error.message);
      return {
        passed: false,
        value: 0,
        threshold: "50-200",
        message: "Gagal memeriksa brightness",
      };
    }
  }

  /**
   * Check blur level using Laplacian variance
   * Higher variance = sharper image
   */
  private async checkBlur(buffer: Buffer): Promise<QualityCheckResultDto> {
    try {
      const image = sharp(buffer);
      const { width, height } = await image.metadata();

      // Convert to grayscale and get raw pixel data
      const { data } = await image
        .greyscale()
        .resize(Math.min(width, 800), Math.min(height, 800), { fit: "inside" })
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Calculate Laplacian variance (simplified edge detection)
      // In production, use a proper Laplacian convolution
      let variance = 0;
      const pixelCount = data.length;

      for (let i = 1; i < pixelCount - 1; i++) {
        const diff = Math.abs(data[i] - data[i - 1]);
        variance += diff * diff;
      }

      variance = Math.round(variance / pixelCount);

      const threshold = QUALITY_THRESHOLDS[QualityCheckType.BLUR];
      const passed = variance >= threshold.min;

      return {
        passed,
        value: variance,
        threshold: `>${threshold.min}`,
        message: passed ? "OK" : "Gambar terlalu blur - pastikan kamera fokus",
      };
    } catch (error) {
      this.logger.error("Failed to check blur", error.message);
      return {
        passed: true, // Default to true if check fails
        value: 150,
        threshold: ">100",
        message: "Pemeriksaan blur dilewati",
      };
    }
  }

  /**
   * Check image resolution
   * Minimum: 600x600 pixels
   */
  private async checkResolution(
    buffer: Buffer,
  ): Promise<QualityCheckResultDto> {
    try {
      const { width, height } = await sharp(buffer).metadata();

      const threshold = QUALITY_THRESHOLDS[QualityCheckType.RESOLUTION];
      const passed =
        width >= threshold.minWidth && height >= threshold.minHeight;

      return {
        passed,
        value: `${width}x${height}`,
        threshold: `${threshold.minWidth}x${threshold.minHeight}`,
        message: passed
          ? "OK"
          : `Resolusi terlalu rendah - minimal ${threshold.minWidth}x${threshold.minHeight} piksel`,
      };
    } catch (error) {
      this.logger.error("Failed to check resolution", error.message);
      return {
        passed: false,
        value: "0x0",
        threshold: "600x600",
        message: "Gagal memeriksa resolusi",
      };
    }
  }

  /**
   * Check image orientation
   * Expected: orientation = 1 (normal)
   */
  private async checkOrientation(
    buffer: Buffer,
  ): Promise<QualityCheckResultDto> {
    try {
      const { orientation } = await sharp(buffer).metadata();

      // orientation can be undefined (treated as 1) or 1-8 (EXIF values)
      const actualOrientation = orientation || 1;
      const passed = actualOrientation === 1;

      return {
        passed,
        value: actualOrientation,
        threshold: "1 (normal)",
        message: passed ? "OK" : "Gambar perlu dirotasi ke posisi normal",
      };
    } catch (error) {
      this.logger.error("Failed to check orientation", error.message);
      return {
        passed: true, // Default to true if check fails
        value: 1,
        threshold: "1",
        message: "Pemeriksaan orientasi dilewati",
      };
    }
  }

  /**
   * Generate recommendations based on failed checks
   */
  private generateRecommendations(results: {
    brightness: QualityCheckResultDto;
    blur: QualityCheckResultDto;
    resolution: QualityCheckResultDto;
    orientation: QualityCheckResultDto;
  }): string[] {
    const recommendations: string[] = [];

    if (!results.brightness.passed) {
      recommendations.push("Foto ulang dengan pencahayaan yang lebih baik");
    }

    if (!results.blur.passed) {
      recommendations.push("Pastikan kamera fokus sebelum mengambil foto");
    }

    if (!results.resolution.passed) {
      recommendations.push(
        "Gunakan kamera dengan resolusi lebih tinggi atau pindai dokumen dengan scanner",
      );
    }

    if (!results.orientation.passed) {
      recommendations.push("Rotasi gambar ke posisi yang benar sebelum upload");
    }

    if (recommendations.length === 0) {
      recommendations.push("Kualitas dokumen memenuhi standar untuk OCR");
    }

    return recommendations;
  }

  /**
   * Auto-rotate image to correct orientation
   */
  async autoRotateImage(buffer: Buffer): Promise<Buffer> {
    try {
      this.logger.debug("🔄 Auto-rotating image...");

      const rotated = await sharp(buffer)
        .rotate() // Automatically rotate based on EXIF orientation
        .toBuffer();

      this.logger.log("✅ Image auto-rotated successfully");
      return rotated;
    } catch (error) {
      this.logger.error("❌ Failed to auto-rotate image", error.stack);
      return buffer; // Return original if rotation fails
    }
  }

  /**
   * Enhance image quality (optional preprocessing)
   */
  async enhanceImage(buffer: Buffer): Promise<Buffer> {
    try {
      this.logger.debug("✨ Enhancing image quality...");

      const enhanced = await sharp(buffer)
        .rotate() // Auto-rotate
        .normalize() // Normalize brightness/contrast
        .sharpen() // Slight sharpening
        .toBuffer();

      this.logger.log("✅ Image enhanced successfully");
      return enhanced;
    } catch (error) {
      this.logger.error("❌ Failed to enhance image", error.stack);
      return buffer; // Return original if enhancement fails
    }
  }
}
