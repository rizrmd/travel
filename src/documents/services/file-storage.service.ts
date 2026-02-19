/**
 * Epic 6, Story 6.1: File Storage Service
 * Abstraction layer for file storage (local filesystem or S3)
 */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * File Storage Interface
 * Abstract contract for file storage implementations
 */
export interface IFileStorageService {
  /**
   * Uploads a file and returns the URL
   */
  upload(file: Buffer, filePath: string, mimeType: string): Promise<string>;

  /**
   * Downloads a file
   */
  download(filePath: string): Promise<Buffer>;

  /**
   * Deletes a file
   */
  delete(filePath: string): Promise<void>;

  /**
   * Checks if file exists
   */
  exists(filePath: string): Promise<boolean>;

  /**
   * Generates a pre-signed URL for file access
   */
  getPresignedUrl(filePath: string, expiryMinutes?: number): Promise<string>;
}

/**
 * Local File Storage Service
 * Implementation for local filesystem storage (development)
 */
@Injectable()
export class LocalFileStorageService implements IFileStorageService {
  private readonly logger = new Logger(LocalFileStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir =
      this.configService.get<string>("FILE_UPLOAD_DIR") ||
      path.join(process.cwd(), "uploads");
    this.baseUrl =
      this.configService.get<string>("FILE_BASE_URL") ||
      (process.env.APP_URL || "http://localhost:3000") + "/uploads";

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  /**
   * Ensures upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Upload directory ensured: ${this.uploadDir}`);
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
    }
  }

  /**
   * Gets full file path
   */
  private getFullPath(filePath: string): string {
    return path.join(this.uploadDir, filePath);
  }

  /**
   * Uploads file to local filesystem
   */
  async upload(
    file: Buffer,
    filePath: string,
    mimeType: string,
  ): Promise<string> {
    try {
      const fullPath = this.getFullPath(filePath);
      const dir = path.dirname(fullPath);

      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(fullPath, file);

      // Return URL
      const fileUrl = `${this.baseUrl}/${filePath}`;
      this.logger.log(`File uploaded: ${fileUrl}`);

      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Downloads file from local filesystem
   */
  async download(filePath: string): Promise<Buffer> {
    try {
      const fullPath = this.getFullPath(filePath);
      const buffer = await fs.readFile(fullPath);
      return buffer;
    } catch (error) {
      this.logger.error(`Failed to download file: ${error.message}`);
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  /**
   * Deletes file from local filesystem
   */
  async delete(filePath: string): Promise<void> {
    try {
      const fullPath = this.getFullPath(filePath);
      await fs.unlink(fullPath);
      this.logger.log(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Checks if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = this.getFullPath(filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generates pre-signed URL (for local, just returns the URL)
   */
  async getPresignedUrl(
    filePath: string,
    expiryMinutes: number = 15,
  ): Promise<string> {
    // For local storage, we just return the URL
    // In production with S3, this would generate a time-limited signed URL
    return `${this.baseUrl}/${filePath}`;
  }

  /**
   * Generates unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }
}

/**
 * S3 File Storage Service (Stub for Phase 2)
 * Implementation for AWS S3 storage (production)
 */
@Injectable()
export class S3FileStorageService implements IFileStorageService {
  private readonly logger = new Logger(S3FileStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.warn(
      "S3FileStorageService is a stub. Implement AWS SDK integration for production.",
    );
  }

  async upload(
    file: Buffer,
    filePath: string,
    mimeType: string,
  ): Promise<string> {
    throw new Error("S3 storage not implemented. Use LocalFileStorageService.");
  }

  async download(filePath: string): Promise<Buffer> {
    throw new Error("S3 storage not implemented. Use LocalFileStorageService.");
  }

  async delete(filePath: string): Promise<void> {
    throw new Error("S3 storage not implemented. Use LocalFileStorageService.");
  }

  async exists(filePath: string): Promise<boolean> {
    throw new Error("S3 storage not implemented. Use LocalFileStorageService.");
  }

  async getPresignedUrl(
    filePath: string,
    expiryMinutes?: number,
  ): Promise<string> {
    throw new Error("S3 storage not implemented. Use LocalFileStorageService.");
  }
}

/**
 * File Storage Service Factory
 * Returns appropriate storage service based on configuration
 */
@Injectable()
export class FileStorageService {
  private readonly storageService: IFileStorageService;

  constructor(
    private readonly localStorageService: LocalFileStorageService,
    private readonly s3StorageService: S3FileStorageService,
    private readonly configService: ConfigService,
  ) {
    const storageType =
      this.configService.get<string>("FILE_STORAGE_TYPE") || "local";

    if (storageType === "s3") {
      this.storageService = this.s3StorageService;
    } else {
      this.storageService = this.localStorageService;
    }
  }

  async upload(
    file: Buffer,
    filePath: string,
    mimeType: string,
  ): Promise<string> {
    return this.storageService.upload(file, filePath, mimeType);
  }

  async download(filePath: string): Promise<Buffer> {
    return this.storageService.download(filePath);
  }

  async delete(filePath: string): Promise<void> {
    return this.storageService.delete(filePath);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.storageService.exists(filePath);
  }

  async getPresignedUrl(
    filePath: string,
    expiryMinutes?: number,
  ): Promise<string> {
    return this.storageService.getPresignedUrl(filePath, expiryMinutes);
  }

  generateUniqueFilename(originalName: string): string {
    if (this.storageService instanceof LocalFileStorageService) {
      return this.storageService.generateUniqueFilename(originalName);
    }
    const ext = path.extname(originalName);
    return `${uuidv4()}${ext}`;
  }
}
