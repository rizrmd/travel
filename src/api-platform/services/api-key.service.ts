import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { ApiKeyEntity } from "../infrastructure/persistence/relational/entities/api-key.entity";
import { ApiKey, ApiKeyEnvironment } from "../domain/api-key";
import { CreateApiKeyDto } from "../dto/create-api-key.dto";
import { ApiKeyResponseDto } from "../dto/api-key-response.dto";

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) { }

  async createKey(
    userId: string,
    tenantId: string,
    dto: CreateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    const keyString = ApiKey.generateKey(dto.environment);
    const keyHash = await bcrypt.hash(keyString, 10);

    const apiKeyInput: any = {
      tenantId,
      userId,
      keyHash,
      name: dto.name,
      environment: dto.environment as any,
      scopes: dto.scopes,
      rateLimit: dto.rateLimit || 1000,
      isActive: true,
      expiresAt: dto.expiresAt,
    };

    const apiKey = this.apiKeyRepository.create(apiKeyInput);
    const savedKey = (await this.apiKeyRepository.save(apiKey)) as any;

    return {
      id: savedKey.id,
      key: keyString, // Only shown on creation
      name: savedKey.name,
      environment: savedKey.environment as ApiKeyEnvironment,
      scopes: savedKey.scopes,
      rateLimit: savedKey.rateLimit,
      isActive: savedKey.isActive,
      lastUsedAt: savedKey.lastUsedAt,
      createdAt: savedKey.createdAt,
      expiresAt: savedKey.expiresAt,
    };
  }

  async validateKey(key: string): Promise<ApiKeyEntity | null> {
    const environment = ApiKey.parseEnvironment(key);

    // Get all keys for this environment
    const keys = await this.apiKeyRepository.find({
      where: { environment: environment as any, isActive: true },
      relations: ["tenant", "user"],
    });

    for (const keyEntity of keys) {
      const isValid = await bcrypt.compare(key, keyEntity.keyHash);
      if (isValid) {
        // Check expiry
        if (keyEntity.expiresAt && keyEntity.expiresAt < new Date()) {
          throw new UnauthorizedException("API key expired");
        }

        return keyEntity;
      }
    }

    return null;
  }

  async regenerateKey(
    keyId: string,
    tenantId: string,
  ): Promise<ApiKeyResponseDto> {
    const existingKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, tenantId },
    });

    if (!existingKey) {
      throw new BadRequestException("API key not found");
    }

    const keyString = ApiKey.generateKey(
      existingKey.environment as unknown as ApiKeyEnvironment,
    );
    const keyHash = await bcrypt.hash(keyString, 10);

    existingKey.keyHash = keyHash;
    const savedKey = await this.apiKeyRepository.save(existingKey);

    return {
      id: savedKey.id,
      key: keyString, // Only shown on regeneration
      name: savedKey.name,
      environment: savedKey.environment as unknown as ApiKeyEnvironment,
      scopes: savedKey.scopes,
      rateLimit: savedKey.rateLimit,
      isActive: savedKey.isActive,
      lastUsedAt: savedKey.lastUsedAt,
      createdAt: savedKey.createdAt,
      expiresAt: savedKey.expiresAt,
    };
  }

  async deactivateKey(keyId: string, tenantId: string): Promise<void> {
    const key = await this.apiKeyRepository.findOne({
      where: { id: keyId, tenantId },
    });

    if (!key) {
      throw new BadRequestException("API key not found");
    }

    key.isActive = false;
    await this.apiKeyRepository.save(key);
  }

  async trackUsage(keyId: string): Promise<void> {
    await this.apiKeyRepository.update(keyId, {
      lastUsedAt: new Date(),
    });
  }

  async listKeys(
    tenantId: string,
    userId: string,
  ): Promise<ApiKeyResponseDto[]> {
    const keys = await this.apiKeyRepository.find({
      where: { tenantId, userId },
      order: { createdAt: "DESC" },
    });

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      environment: key.environment as unknown as ApiKeyEnvironment,
      scopes: key.scopes,
      rateLimit: key.rateLimit,
      isActive: key.isActive,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
    }));
  }

  async getKey(keyId: string, tenantId: string): Promise<ApiKeyResponseDto> {
    const key = await this.apiKeyRepository.findOne({
      where: { id: keyId, tenantId },
    });

    if (!key) {
      throw new BadRequestException("API key not found");
    }

    return {
      id: key.id,
      name: key.name,
      environment: key.environment as unknown as ApiKeyEnvironment,
      scopes: key.scopes,
      rateLimit: key.rateLimit,
      isActive: key.isActive,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
    };
  }
}
