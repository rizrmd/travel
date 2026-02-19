/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Verihubs OCR Service - Indonesia-optimized OCR provider
 * Supports dual-mode operation: STUB (default) and PRODUCTION
 */

import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { KtpDataDto } from "../dto/ktp-data.dto";
import { PassportDataDto } from "../dto/passport-data.dto";
import { KkDataDto, FamilyMemberDto } from "../dto/kk-data.dto";

@Injectable()
export class VerihubsOcrService {
  private readonly logger = new Logger(VerihubsOcrService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly isProduction: boolean;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>("VERIHUBS_API_URL", "");
    this.apiKey = this.configService.get<string>("VERIHUBS_API_KEY", "");
    this.apiSecret = this.configService.get<string>("VERIHUBS_API_SECRET", "");
    this.isProduction =
      this.configService.get<string>("OCR_ENABLED", "false") === "true";

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log mode on initialization
    if (this.isProduction) {
      this.logger.log("🚀 Verihubs OCR Service initialized in PRODUCTION mode");
      this.logger.log(`📍 API URL: ${this.apiUrl}`);
    } else {
      this.logger.warn("⚠️  Verihubs OCR Service initialized in STUB mode");
      this.logger.warn("💡 Set OCR_ENABLED=true to enable production mode");
    }
  }

  /**
   * Extract KTP (Indonesian ID Card) data
   */
  async extractKtpData(imageBuffer: Buffer): Promise<KtpDataDto> {
    if (!this.isProduction) {
      this.logger.debug("📄 Returning mock KTP data (STUB mode)");
      return this.mockKtpData();
    }

    try {
      this.logger.log("🔄 Extracting KTP data via Verihubs API...");

      const formData = new FormData();
      formData.append("image", imageBuffer, {
        filename: "ktp.jpg",
        contentType: "image/jpeg",
      });

      const response = await this.axiosInstance.post("/ocr/ktp", formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.apiKey}`,
          "X-API-Secret": this.apiSecret,
        },
      });

      const mappedData = this.mapKtpResponse(response.data);
      this.logger.log(
        `✅ KTP data extracted (confidence: ${mappedData.confidenceScore}%)`,
      );

      return mappedData;
    } catch (error) {
      this.logger.error(
        "❌ Failed to extract KTP data from Verihubs",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Failed to extract KTP data. Please check image quality and try again.",
      );
    }
  }

  /**
   * Extract Passport data
   */
  async extractPassportData(imageBuffer: Buffer): Promise<PassportDataDto> {
    if (!this.isProduction) {
      this.logger.debug("📄 Returning mock Passport data (STUB mode)");
      return this.mockPassportData();
    }

    try {
      this.logger.log("🔄 Extracting Passport data via Verihubs API...");

      const formData = new FormData();
      formData.append("image", imageBuffer, {
        filename: "passport.jpg",
        contentType: "image/jpeg",
      });

      const response = await this.axiosInstance.post(
        "/ocr/passport",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.apiKey}`,
            "X-API-Secret": this.apiSecret,
          },
        },
      );

      const mappedData = this.mapPassportResponse(response.data);
      this.logger.log(
        `✅ Passport data extracted (confidence: ${mappedData.confidenceScore}%)`,
      );

      return mappedData;
    } catch (error) {
      this.logger.error(
        "❌ Failed to extract Passport data from Verihubs",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Failed to extract Passport data. Please check image quality and try again.",
      );
    }
  }

  /**
   * Extract KK (Kartu Keluarga) data
   */
  async extractKkData(imageBuffer: Buffer): Promise<KkDataDto> {
    if (!this.isProduction) {
      this.logger.debug("📄 Returning mock KK data (STUB mode)");
      return this.mockKkData();
    }

    try {
      this.logger.log("🔄 Extracting KK data via Verihubs API...");

      const formData = new FormData();
      formData.append("image", imageBuffer, {
        filename: "kk.jpg",
        contentType: "image/jpeg",
      });

      const response = await this.axiosInstance.post("/ocr/kk", formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.apiKey}`,
          "X-API-Secret": this.apiSecret,
        },
      });

      const mappedData = this.mapKkResponse(response.data);
      this.logger.log(
        `✅ KK data extracted (confidence: ${mappedData.confidenceScore}%)`,
      );

      return mappedData;
    } catch (error) {
      this.logger.error(
        "❌ Failed to extract KK data from Verihubs",
        error.stack,
      );
      throw new InternalServerErrorException(
        "Failed to extract KK data. Please check image quality and try again.",
      );
    }
  }

  /**
   * Map Verihubs KTP response to our DTO
   */
  private mapKtpResponse(data: any): KtpDataDto {
    return {
      nik: data.nik || data.ktp_number || "",
      fullName: data.nama || data.full_name || "",
      placeOfBirth: data.tempat_lahir || data.place_of_birth || "",
      dateOfBirth: data.tanggal_lahir || data.date_of_birth || "",
      gender: data.jenis_kelamin || data.gender || "",
      address: data.alamat || data.address || "",
      rtRw: data.rt_rw || data.rt_rw_number || "",
      kelurahan: data.kel_desa || data.kelurahan || data.village || "",
      kecamatan: data.kecamatan || data.district || "",
      religion: data.agama || data.religion || "",
      maritalStatus: data.status_perkawinan || data.marital_status || "",
      occupation: data.pekerjaan || data.occupation || "",
      nationality: data.kewarganegaraan || data.nationality || "WNI",
      validUntil: data.berlaku_hingga || data.valid_until || "SEUMUR HIDUP",
      confidenceScore: data.confidence_score || data.confidence || 85.0,
      province: data.provinsi || data.province,
      city: data.kabupaten_kota || data.city,
    };
  }

  /**
   * Map Verihubs Passport response to our DTO
   */
  private mapPassportResponse(data: any): PassportDataDto {
    return {
      passportNumber: data.passport_number || data.document_number || "",
      fullName: data.full_name || data.name || "",
      nationality: data.nationality || data.country_code || "",
      dateOfBirth: data.date_of_birth || data.birth_date || "",
      placeOfBirth: data.place_of_birth || data.birth_place || "",
      gender: data.gender || data.sex || "",
      dateOfIssue: data.date_of_issue || data.issue_date || "",
      dateOfExpiry: data.date_of_expiry || data.expiry_date || "",
      placeOfIssue: data.place_of_issue || data.issuing_authority,
      mrzLine1: data.mrz_line_1 || data.mrz1,
      mrzLine2: data.mrz_line_2 || data.mrz2,
      confidenceScore: data.confidence_score || data.confidence || 90.0,
      passportType: data.passport_type || data.document_type,
    };
  }

  /**
   * Map Verihubs KK response to our DTO
   */
  private mapKkResponse(data: any): KkDataDto {
    const members: FamilyMemberDto[] = [];

    if (data.family_members && Array.isArray(data.family_members)) {
      data.family_members.forEach((member: any) => {
        members.push({
          nik: member.nik || "",
          name: member.nama || member.name || "",
          relationship: member.hubungan_keluarga || member.relationship || "",
          gender: member.jenis_kelamin || member.gender || "",
          dateOfBirth: member.tanggal_lahir || member.date_of_birth || "",
          maritalStatus: member.status_perkawinan || member.marital_status,
        });
      });
    }

    return {
      nomorKk: data.nomor_kk || data.kk_number || "",
      address: data.alamat || data.address || "",
      rtRw: data.rt_rw || "",
      kelurahan: data.kel_desa || data.kelurahan || "",
      kecamatan: data.kecamatan || "",
      kabupatenKota: data.kabupaten_kota || data.city || "",
      province: data.provinsi || data.province || "",
      postalCode: data.kode_pos || data.postal_code,
      headOfFamilyName: data.kepala_keluarga || data.head_of_family || "",
      members: members.length > 0 ? members : undefined,
      confidenceScore: data.confidence_score || data.confidence || 85.0,
    };
  }

  /**
   * Generate mock KTP data for STUB mode
   */
  private mockKtpData(): KtpDataDto {
    const mockData: KtpDataDto = {
      nik: "3201234567890123",
      fullName: "Ahmad Rizki Maulana",
      placeOfBirth: "Jakarta",
      dateOfBirth: "1985-05-15",
      gender: "LAKI-LAKI",
      address: "Jl. Sudirman No. 123",
      rtRw: "001/002",
      kelurahan: "Menteng",
      kecamatan: "Menteng",
      religion: "ISLAM",
      maritalStatus: "KAWIN",
      occupation: "WIRASWASTA",
      nationality: "WNI",
      validUntil: "SEUMUR HIDUP",
      confidenceScore: 95.5,
      province: "DKI JAKARTA",
      city: "JAKARTA PUSAT",
    };

    return mockData;
  }

  /**
   * Generate mock Passport data for STUB mode
   */
  private mockPassportData(): PassportDataDto {
    const mockData: PassportDataDto = {
      passportNumber: "A1234567",
      fullName: "AHMAD RIZKI MAULANA",
      nationality: "INDONESIA",
      dateOfBirth: "1985-05-15",
      placeOfBirth: "JAKARTA",
      gender: "M",
      dateOfIssue: "2020-01-15",
      dateOfExpiry: "2025-01-15",
      placeOfIssue: "JAKARTA",
      mrzLine1: "P<IDNMAULANA<<AHMAD<RIZKI<<<<<<<<<<<<<<<<<<",
      mrzLine2: "A12345678IDN8505155M2501154<<<<<<<<<<<<<<04",
      confidenceScore: 92.8,
      passportType: "P",
    };

    return mockData;
  }

  /**
   * Generate mock KK data for STUB mode
   */
  private mockKkData(): KkDataDto {
    const mockData: KkDataDto = {
      nomorKk: "3201234567890123",
      address: "Jl. Sudirman No. 123",
      rtRw: "001/002",
      kelurahan: "Menteng",
      kecamatan: "Menteng",
      kabupatenKota: "JAKARTA PUSAT",
      province: "DKI JAKARTA",
      postalCode: "10310",
      headOfFamilyName: "Ahmad Rizki Maulana",
      members: [
        {
          nik: "3201234567890123",
          name: "Ahmad Rizki Maulana",
          relationship: "KEPALA KELUARGA",
          gender: "LAKI-LAKI",
          dateOfBirth: "1985-05-15",
          maritalStatus: "KAWIN",
        },
        {
          nik: "3201234567890124",
          name: "Siti Nurhaliza",
          relationship: "ISTRI",
          gender: "PEREMPUAN",
          dateOfBirth: "1988-03-20",
          maritalStatus: "KAWIN",
        },
        {
          nik: "3201234567890125",
          name: "Muhammad Farhan",
          relationship: "ANAK",
          gender: "LAKI-LAKI",
          dateOfBirth: "2015-07-10",
          maritalStatus: "BELUM KAWIN",
        },
      ],
      confidenceScore: 88.5,
    };

    return mockData;
  }

  /**
   * Get service status
   */
  getStatus(): {
    mode: string;
    enabled: boolean;
    provider: string;
    apiUrl: string;
  } {
    return {
      mode: this.isProduction ? "PRODUCTION" : "STUB",
      enabled: this.isProduction,
      provider: "Verihubs",
      apiUrl: this.apiUrl,
    };
  }
}
