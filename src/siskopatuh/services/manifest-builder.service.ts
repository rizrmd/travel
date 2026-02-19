/**
 * Integration 6: SISKOPATUH Manifest Builder Service
 * Builds departure and return manifests from package and jamaah data
 */

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { DepartureManifestDto, ReturnManifestDto } from "../dto";
import { JamaahStatus } from "../../jamaah/domain/jamaah";

@Injectable()
export class ManifestBuilderService {
  private readonly logger = new Logger(ManifestBuilderService.name);

  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
  ) {}

  /**
   * Build departure manifest for a package
   */
  async buildDepartureManifest(
    packageId: string,
    tenantId: string,
  ): Promise<DepartureManifestDto> {
    // Fetch package details
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId, deleted_at: null },
    });

    if (!packageEntity) {
      throw new NotFoundException(`Package ${packageId} not found`);
    }

    // Fetch all ready jamaah for this package
    const jamaahList = await this.jamaahRepository.find({
      where: {
        package_id: packageId,
        tenant_id: tenantId,
        status: JamaahStatus.READY,
        deleted_at: null,
      },
      order: { created_at: "ASC" },
    });

    if (jamaahList.length === 0) {
      throw new NotFoundException(
        `No ready jamaah found for package ${packageId}`,
      );
    }

    // Extract metadata for flight, hotel, and muthawif details
    const metadata = packageEntity.metadata || {};
    const flightDetails = metadata.flight_details || {};
    const hotelDetails = metadata.hotel_details || {};
    const muthawifDetails = metadata.muthawif_details || {};

    // Build departure manifest
    const manifest: DepartureManifestDto = {
      paket_id: packageEntity.id,
      nama_paket: packageEntity.name,
      tanggal_keberangkatan: this.formatDate(packageEntity.departure_date),
      tanggal_kepulangan_rencana: this.formatDate(packageEntity.return_date),
      jumlah_jamaah: jamaahList.length,
      detail_penerbangan: {
        maskapai: flightDetails.airline || "TBD",
        nomor_penerbangan: flightDetails.flight_number || "TBD",
        bandara_keberangkatan:
          flightDetails.departure_airport || "CGK - Soekarno-Hatta",
        bandara_tujuan:
          flightDetails.arrival_airport || "JED - King Abdulaziz International",
        waktu_keberangkatan:
          flightDetails.departure_time ||
          new Date(packageEntity.departure_date).toISOString(),
        waktu_tiba:
          flightDetails.arrival_time ||
          new Date(packageEntity.departure_date).toISOString(),
      },
      detail_hotel: {
        nama_hotel_makkah: hotelDetails.makkah_hotel_name || "TBD",
        alamat_hotel_makkah: hotelDetails.makkah_hotel_address || "TBD",
        jarak_masjidil_haram: hotelDetails.distance_to_haram || 500,
        nama_hotel_madinah: hotelDetails.madinah_hotel_name || "TBD",
        alamat_hotel_madinah: hotelDetails.madinah_hotel_address || "TBD",
        jarak_masjid_nabawi: hotelDetails.distance_to_nabawi || 300,
      },
      detail_muthawif: {
        nama: muthawifDetails.name || "TBD",
        nomor_lisensi: muthawifDetails.license_number || "TBD",
        nomor_telepon: muthawifDetails.phone || "TBD",
        perusahaan: muthawifDetails.company || "TBD",
      },
      daftar_jamaah: jamaahList.map((jamaah) => ({
        jamaah_id: jamaah.id,
        nik: jamaah.metadata?.nik || "TBD",
        nama_lengkap: jamaah.full_name,
        nomor_paspor: jamaah.metadata?.passport_number || "TBD",
        nomor_kursi: jamaah.metadata?.seat_number,
      })),
    };

    this.logger.log(
      `Built departure manifest for package ${packageId} with ${jamaahList.length} jamaah`,
    );

    return manifest;
  }

  /**
   * Build return manifest for a package
   */
  async buildReturnManifest(
    packageId: string,
    tenantId: string,
    departureManifestReference: string,
  ): Promise<ReturnManifestDto> {
    // Fetch package details
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId, deleted_at: null },
    });

    if (!packageEntity) {
      throw new NotFoundException(`Package ${packageId} not found`);
    }

    // Fetch all jamaah for this package (including those who may have extended)
    const jamaahList = await this.jamaahRepository.find({
      where: {
        package_id: packageId,
        tenant_id: tenantId,
        deleted_at: null,
      },
      order: { created_at: "ASC" },
    });

    if (jamaahList.length === 0) {
      throw new NotFoundException(`No jamaah found for package ${packageId}`);
    }

    // Extract metadata for return flight
    const metadata = packageEntity.metadata || {};
    const returnFlightDetails = metadata.return_flight_details || {};

    // Build return manifest
    const manifest: ReturnManifestDto = {
      paket_id: packageEntity.id,
      referensi_manifest_keberangkatan: departureManifestReference,
      tanggal_kepulangan_aktual: this.formatDate(
        returnFlightDetails.actual_return_date || packageEntity.return_date,
      ),
      detail_penerbangan: {
        maskapai: returnFlightDetails.airline || "TBD",
        nomor_penerbangan: returnFlightDetails.flight_number || "TBD",
        bandara_keberangkatan:
          returnFlightDetails.departure_airport ||
          "JED - King Abdulaziz International",
        bandara_tujuan:
          returnFlightDetails.arrival_airport || "CGK - Soekarno-Hatta",
        waktu_keberangkatan:
          returnFlightDetails.departure_time ||
          new Date(packageEntity.return_date).toISOString(),
        waktu_tiba:
          returnFlightDetails.arrival_time ||
          new Date(packageEntity.return_date).toISOString(),
      },
      daftar_jamaah: jamaahList.map((jamaah) => {
        const returnStatus = this.determineReturnStatus(jamaah);
        return {
          jamaah_id: jamaah.id,
          nik: jamaah.metadata?.nik || "TBD",
          nama_lengkap: jamaah.full_name,
          nomor_paspor: jamaah.metadata?.passport_number || "TBD",
          status_kepulangan: returnStatus,
          nomor_kursi: jamaah.metadata?.return_seat_number,
          catatan: jamaah.metadata?.return_notes,
        };
      }),
    };

    this.logger.log(
      `Built return manifest for package ${packageId} with ${jamaahList.length} jamaah`,
    );

    return manifest;
  }

  /**
   * Determine return status for a jamaah
   */
  private determineReturnStatus(jamaah: JamaahEntity): string {
    const returnStatus = jamaah.metadata?.return_status;

    if (returnStatus === "extended") return "extended";
    if (returnStatus === "not_returned") return "not_returned";

    // Default to returned if jamaah status is completed
    if (jamaah.status === JamaahStatus.COMPLETED) return "returned";

    return "returned"; // Default
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
