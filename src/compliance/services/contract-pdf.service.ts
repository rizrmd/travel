/**
 * Epic 12, Story 12.1: Contract PDF Service
 * Generate PDFs from HTML contracts
 */

import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";

@Injectable()
export class ContractPdfService {
  /**
   * Generate PDF from HTML content
   * Note: In production, use Puppeteer for HTML to PDF
   * This is a simplified implementation using PDFKit
   */
  async generatePDF(
    htmlContent: string,
    options?: {
      watermark?: string;
      includeQrCode?: boolean;
      contractNumber?: string;
    },
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Add watermark if specified
        if (options?.watermark) {
          doc
            .fontSize(60)
            .fillColor("#cccccc", 0.3)
            .text(options.watermark, 100, 300, {
              align: "center",
              angle: 45,
            });
        }

        // Add content (simplified - in production parse HTML)
        doc
          .fillColor("#000000")
          .fontSize(20)
          .text("AKAD WAKALAH BIL UJRAH", { align: "center" });

        if (options?.contractNumber) {
          doc
            .fontSize(12)
            .text(`Nomor: ${options.contractNumber}`, { align: "center" });
        }

        doc.moveDown();
        doc.fontSize(10).text(this.stripHtml(htmlContent));

        // Add QR code placeholder if specified
        if (options?.includeQrCode && options?.contractNumber) {
          doc.moveDown();
          doc.text(`QR Code: ${options.contractNumber}`, { align: "center" });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Strip HTML tags (simplified)
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  /**
   * Save PDF to file
   */
  async savePDF(buffer: Buffer, filePath: string): Promise<void> {
    await fs.promises.writeFile(filePath, buffer);
  }

  /**
   * Generate PDF with Islamic design
   */
  async generateIslamicDesignPDF(
    content: string,
    contractNumber: string,
    isDraft: boolean = false,
  ): Promise<Buffer> {
    return await this.generatePDF(content, {
      watermark: isDraft ? "DRAFT" : undefined,
      includeQrCode: true,
      contractNumber,
    });
  }
}
