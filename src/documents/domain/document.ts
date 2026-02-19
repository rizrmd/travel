/**
 * Epic 6, Story 6.1: Document Domain Model
 * Business logic and validation rules for documents
 */

/**
 * Document Type Enum
 * Defines all accepted document types for jamaah
 */
export enum DocumentType {
  PASSPORT = "passport",
  KTP = "ktp",
  KK = "kk", // Kartu Keluarga (Family Card)
  PHOTO = "photo", // 4x6 white background
  VACCINATION = "vaccination", // Yellow book
  VISA = "visa",
  FLIGHT_TICKET = "flight_ticket",
  HOTEL_VOUCHER = "hotel_voucher",
  INSURANCE = "insurance",
  OTHER = "other",
}

/**
 * Document Status Enum
 * Tracks the review and approval status
 */
export enum DocumentStatus {
  PENDING = "pending", // Awaiting review
  APPROVED = "approved", // Approved by admin
  REJECTED = "rejected", // Rejected - needs reupload
  EXPIRED = "expired", // Past expiration date
}

/**
 * Uploader Type Enum
 * Identifies who uploaded the document
 */
export enum UploaderType {
  AGENT = "agent",
  JAMAAH = "jamaah",
  ADMIN = "admin",
}

/**
 * File MIME Type Enum
 * Allowed file formats
 */
export enum FileMimeType {
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  PNG = "image/png",
  PDF = "application/pdf",
}

/**
 * Document Domain Model
 * Core business entity with validation rules
 */
export class Document {
  id: string;
  tenantId: string;
  jamaahId: string;
  documentType: DocumentType;
  fileUrl: string;
  fileSize: number;
  fileMimeType: FileMimeType;
  status: DocumentStatus;
  uploaderType: UploaderType;
  uploadedById: string;
  reviewedById?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  extractedData?: Record<string, any>; // OCR results (Phase 2)
  expiresAt?: Date; // For documents with expiration (passport, visa, etc.)
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  /**
   * Maximum file size in bytes (10MB)
   */
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Allowed MIME types
   */
  static readonly ALLOWED_MIME_TYPES = [
    FileMimeType.JPEG,
    FileMimeType.JPG,
    FileMimeType.PNG,
    FileMimeType.PDF,
  ];

  /**
   * Document types that require expiration date
   */
  static readonly EXPIRABLE_TYPES = [
    DocumentType.PASSPORT,
    DocumentType.VISA,
    DocumentType.VACCINATION,
  ];

  /**
   * Validates if file size is within allowed limit
   */
  static isValidFileSize(size: number): boolean {
    return size > 0 && size <= this.MAX_FILE_SIZE;
  }

  /**
   * Validates if MIME type is allowed
   */
  static isValidMimeType(mimeType: string): boolean {
    return this.ALLOWED_MIME_TYPES.includes(mimeType as FileMimeType);
  }

  /**
   * Checks if document type requires expiration date
   */
  static requiresExpiration(type: DocumentType): boolean {
    return this.EXPIRABLE_TYPES.includes(type);
  }

  /**
   * Validates if document can be approved
   */
  canBeApproved(): boolean {
    return this.status === DocumentStatus.PENDING;
  }

  /**
   * Validates if document can be rejected
   */
  canBeRejected(): boolean {
    return this.status === DocumentStatus.PENDING;
  }

  /**
   * Checks if document is expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  /**
   * Approves the document
   */
  approve(reviewerId: string): void {
    if (!this.canBeApproved()) {
      throw new Error(
        `Document cannot be approved. Current status: ${this.status}`,
      );
    }
    this.status = DocumentStatus.APPROVED;
    this.reviewedById = reviewerId;
    this.reviewedAt = new Date();
    this.rejectionReason = undefined;
  }

  /**
   * Rejects the document with reason
   */
  reject(reviewerId: string, reason: string): void {
    if (!this.canBeRejected()) {
      throw new Error(
        `Document cannot be rejected. Current status: ${this.status}`,
      );
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error("Rejection reason is required");
    }
    this.status = DocumentStatus.REJECTED;
    this.reviewedById = reviewerId;
    this.reviewedAt = new Date();
    this.rejectionReason = reason;
  }

  /**
   * Marks document as expired
   */
  markAsExpired(): void {
    if (this.isExpired()) {
      this.status = DocumentStatus.EXPIRED;
    }
  }

  /**
   * Generates file storage path
   */
  static generateFilePath(
    tenantId: string,
    jamaahId: string,
    documentType: DocumentType,
    filename: string,
  ): string {
    return `uploads/${tenantId}/${jamaahId}/${documentType}/${filename}`;
  }

  /**
   * Extracts file extension from filename
   */
  static getFileExtension(filename: string): string {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }

  /**
   * Gets MIME type from file extension
   */
  static getMimeTypeFromExtension(extension: string): FileMimeType | null {
    const mimeMap: Record<string, FileMimeType> = {
      jpg: FileMimeType.JPEG,
      jpeg: FileMimeType.JPEG,
      png: FileMimeType.PNG,
      pdf: FileMimeType.PDF,
    };
    return mimeMap[extension.toLowerCase()] || null;
  }

  /**
   * Validates file extension matches MIME type
   */
  static validateExtensionMimeType(
    filename: string,
    mimeType: string,
  ): boolean {
    const extension = this.getFileExtension(filename);
    const expectedMimeType = this.getMimeTypeFromExtension(extension);
    return expectedMimeType === mimeType;
  }
}

/**
 * Document Review Value Object
 * Encapsulates review information
 */
export class DocumentReview {
  documentId: string;
  status: DocumentStatus.APPROVED | DocumentStatus.REJECTED;
  reviewedBy: string;
  reviewNotes?: string;
  reviewedAt: Date;

  constructor(
    documentId: string,
    status: DocumentStatus.APPROVED | DocumentStatus.REJECTED,
    reviewedBy: string,
    reviewNotes?: string,
  ) {
    this.documentId = documentId;
    this.status = status;
    this.reviewedBy = reviewedBy;
    this.reviewNotes = reviewNotes;
    this.reviewedAt = new Date();
  }

  /**
   * Validates review data
   */
  validate(): void {
    if (!this.documentId) {
      throw new Error("Document ID is required");
    }
    if (!this.reviewedBy) {
      throw new Error("Reviewer ID is required");
    }
    if (this.status === DocumentStatus.REJECTED && !this.reviewNotes) {
      throw new Error("Review notes are required for rejected documents");
    }
  }
}
