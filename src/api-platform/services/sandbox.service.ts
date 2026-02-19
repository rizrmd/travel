import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";

@Injectable()
export class SandboxService {
  constructor(
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) { }

  async resetSandbox(tenantId: string): Promise<void> {
    // Delete all sandbox data for tenant
    // Note: Only delete data created with sandbox API keys

    await this.jamaahRepository
      .createQueryBuilder()
      .delete()
      .where("tenant_id = :tenantId", { tenantId })
      .andWhere("metadata->>'sandbox' = 'true'")
      .execute();

    // Reset other resources similarly
  }

  async generateSampleData(tenantId: string): Promise<void> {
    // Generate sample jamaah
    const sampleJamaah = [
      {
        tenant_id: tenantId,
        name: "Ahmad Rizki",
        email: "ahmad.rizki@example.com",
        phone: "081234567890",
        nik: "3201234567890001",
        dateOfBirth: new Date("1990-01-15"),
        gender: "male",
        address: "Jl. Contoh No. 123, Jakarta",
        emergencyContact: "081234567891",
        status: "lead" as any,
        metadata: { sandbox: true },
      },
      {
        tenant_id: tenantId,
        name: "Siti Aminah",
        email: "siti.aminah@example.com",
        phone: "081234567892",
        nik: "3201234567890002",
        dateOfBirth: new Date("1985-05-20"),
        gender: "female",
        address: "Jl. Contoh No. 456, Bandung",
        emergencyContact: "081234567893",
        status: "registered" as any,
        metadata: { sandbox: true },
      },
      {
        tenant_id: tenantId,
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        phone: "081234567894",
        nik: "3201234567890003",
        dateOfBirth: new Date("1988-08-10"),
        gender: "male",
        address: "Jl. Contoh No. 789, Surabaya",
        emergencyContact: "081234567895",
        status: "registered" as any,
        metadata: { sandbox: true },
      },
    ];

    for (const data of sampleJamaah) {
      const jamaah = this.jamaahRepository.create(data);
      await this.jamaahRepository.save(jamaah);
    }

    // Generate sample packages
    const samplePackages = [
      {
        tenant_id: tenantId,
        name: "Paket Umroh Ekonomis 9 Hari",
        description: "Paket umroh 9 hari dengan fasilitas lengkap",
        retail_price: 25000000,
        wholesale_price: 20000000,
        duration_days: 9,
        capacity: 45,
        available_slots: 45,
        departure_date: new Date("2025-03-01"),
        return_date: new Date("2025-03-09"),
        metadata: { sandbox: true },
      },
    ];

    for (const data of samplePackages) {
      const packageEntity = this.packageRepository.create(data);
      await this.packageRepository.save(packageEntity);
    }
  }

  async switchEnvironment(
    apiKeyId: string,
    environment: "production" | "sandbox",
  ): Promise<void> {
    // Switch API key environment
    // This would typically involve updating the API key record
  }
}
