/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Document types supported by OCR
 */

export enum OcrDocumentType {
  KTP = "ktp",
  PASSPORT = "passport",
  KK = "kk", // Kartu Keluarga
  VACCINATION = "vaccination",
  VISA = "visa",
}

/**
 * Check if document type is supported by OCR
 */
export function isOcrSupported(documentType: string): boolean {
  return Object.values(OcrDocumentType).includes(
    documentType as OcrDocumentType,
  );
}
