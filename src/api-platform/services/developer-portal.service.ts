import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../users/entities/user.entity";
import { ApiKeyEntity } from "../infrastructure/persistence/relational/entities/api-key.entity";
import { ApiRequestLogEntity } from "../infrastructure/persistence/relational/entities/api-request-log.entity";
import { DeveloperRegistrationDto } from "../dto/developer-registration.dto";
import { ApiKeyEnvironment } from "../domain/api-key";
import { ApiKeyService } from "./api-key.service";

@Injectable()
export class DeveloperPortalService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    @InjectRepository(ApiRequestLogEntity)
    private readonly apiRequestLogRepository: Repository<ApiRequestLogEntity>,
    private readonly apiKeyService: ApiKeyService,
  ) { }

  async registerDeveloper(
    dto: DeveloperRegistrationDto,
    tenantId: string,
  ): Promise<any> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create developer user
    const user = this.userRepository.create({
      email: dto.email,
      fullName: dto.name,
      password: hashedPassword,
      tenantId,
      role: "AGENT" as any, // Default role for developers
    });

    const savedUser = (await this.userRepository.save(user)) as any;

    // Generate sandbox API key automatically
    const apiKey = await this.apiKeyService.createKey(savedUser.id, tenantId, {
      name: "Default Sandbox Key",
      environment: ApiKeyEnvironment.SANDBOX,
      scopes: ["*"],
      rateLimit: 1000,
    });

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.fullName,
      },
      apiKey: {
        id: apiKey.id,
        key: apiKey.key,
        environment: apiKey.environment,
      },
    };
  }

  async getDashboard(userId: string, tenantId: string): Promise<any> {
    const apiKeys = await this.apiKeyRepository.find({
      where: { userId, tenantId },
    });

    // Get usage stats for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await this.apiRequestLogRepository
      .createQueryBuilder("log")
      .select("COUNT(*)", "total_requests")
      .addSelect("AVG(log.response_time_ms)", "avg_response_time")
      .addSelect(
        "COUNT(CASE WHEN log.status_code >= 400 THEN 1 END)",
        "error_count",
      )
      .where("log.tenant_id = :tenantId", { tenantId })
      .andWhere("log.user_id = :userId", { userId })
      .andWhere("log.created_at >= :since", { since: thirtyDaysAgo })
      .getRawOne();

    return {
      apiKeys: apiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        environment: key.environment,
        lastUsedAt: key.lastUsedAt,
        isActive: key.isActive,
      })),
      usage: {
        totalRequests: parseInt(stats.total_requests) || 0,
        avgResponseTime: parseFloat(stats.avg_response_time) || 0,
        errorCount: parseInt(stats.error_count) || 0,
        errorRate:
          stats.total_requests > 0
            ? (
              (parseInt(stats.error_count) / parseInt(stats.total_requests)) *
              100
            ).toFixed(2)
            : 0,
      },
    };
  }

  async getApiDocs(): Promise<any> {
    // Return Swagger JSON
    return {
      openapi: "3.0.0",
      info: {
        title: "Travel Umroh Public API",
        version: "1.0.0",
        description: "Public API for Travel Umroh Platform",
      },
      servers: [
        {
          url: "https://api.travelumroh.com/public/v1",
          description: "Production server",
        },
        {
          url: "https://sandbox-api.travelumroh.com/public/v1",
          description: "Sandbox server",
        },
      ],
      paths: {},
    };
  }
}
