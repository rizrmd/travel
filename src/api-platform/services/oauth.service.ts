import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { OAuthClientEntity } from "../infrastructure/persistence/relational/entities/oauth-client.entity";
import { AccessTokenEntity } from "../infrastructure/persistence/relational/entities/access-token.entity";
import { OAuthClient } from "../domain/oauth-client";
import { CreateOAuthClientDto } from "../dto/create-oauth-client.dto";
import { OAuthClientResponseDto } from "../dto/oauth-client-response.dto";
import { OAuthTokenRequestDto } from "../dto/oauth-token-request.dto";
import { OAuthTokenResponseDto } from "../dto/oauth-token-response.dto";

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuthClientEntity)
    private readonly oauthClientRepository: Repository<OAuthClientEntity>,
    @InjectRepository(AccessTokenEntity)
    private readonly accessTokenRepository: Repository<AccessTokenEntity>,
  ) {}

  async registerClient(
    tenantId: string,
    dto: CreateOAuthClientDto,
  ): Promise<OAuthClientResponseDto> {
    const clientId = OAuthClient.generateClientId();
    const clientSecret = OAuthClient.generateClientSecret();
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);

    const client = this.oauthClientRepository.create({
      tenantId,
      clientId,
      clientSecretHash,
      name: dto.name,
      description: dto.description,
      redirectUris: dto.redirectUris || [],
      scopes: dto.scopes,
      isActive: true,
    });

    const savedClient = await this.oauthClientRepository.save(client);

    return {
      id: savedClient.id,
      clientId: savedClient.clientId,
      clientSecret, // Only shown on creation
      name: savedClient.name,
      description: savedClient.description,
      redirectUris: savedClient.redirectUris,
      scopes: savedClient.scopes,
      isActive: savedClient.isActive,
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt,
    };
  }

  async generateToken(
    dto: OAuthTokenRequestDto,
  ): Promise<OAuthTokenResponseDto> {
    if (dto.grant_type !== "client_credentials") {
      throw new BadRequestException(
        "Only client_credentials grant type is supported",
      );
    }

    // Find client
    const client = await this.oauthClientRepository.findOne({
      where: { clientId: dto.client_id, isActive: true },
    });

    if (!client) {
      throw new UnauthorizedException("Invalid client credentials");
    }

    // Verify client secret
    const isValidSecret = await bcrypt.compare(
      dto.client_secret,
      client.clientSecretHash,
    );
    if (!isValidSecret) {
      throw new UnauthorizedException("Invalid client credentials");
    }

    // Parse requested scopes
    const requestedScopes = dto.scope ? dto.scope.split(" ") : client.scopes;

    // Validate scopes
    const invalidScopes = requestedScopes.filter(
      (scope) => !client.scopes.includes(scope),
    );
    if (invalidScopes.length > 0) {
      throw new BadRequestException(
        `Invalid scopes: ${invalidScopes.join(", ")}`,
      );
    }

    // Generate access token
    const tokenString = `tok_${crypto.randomBytes(32).toString("hex")}`;
    const tokenHash = await bcrypt.hash(tokenString, 10);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    const token = this.accessTokenRepository.create({
      tenantId: client.tenantId,
      clientId: client.clientId,
      tokenHash,
      scopes: requestedScopes,
      expiresAt,
    });

    await this.accessTokenRepository.save(token);

    return {
      access_token: tokenString,
      token_type: "Bearer",
      expires_in: 3600,
      scope: requestedScopes.join(" "),
    };
  }

  async validateToken(token: string): Promise<AccessTokenEntity | null> {
    // Get all tokens and check hash
    const tokens = await this.accessTokenRepository.find({
      where: { expiresAt: new Date() },
      relations: ["client", "tenant"],
    });

    for (const tokenEntity of tokens) {
      const isValid = await bcrypt.compare(token, tokenEntity.tokenHash);
      if (isValid) {
        // Check expiry
        if (tokenEntity.expiresAt < new Date()) {
          throw new UnauthorizedException("Token expired");
        }
        return tokenEntity;
      }
    }

    return null;
  }

  async revokeToken(
    token: string,
    clientId: string,
    clientSecret: string,
  ): Promise<void> {
    // Verify client
    const client = await this.oauthClientRepository.findOne({
      where: { clientId, isActive: true },
    });

    if (!client) {
      throw new UnauthorizedException("Invalid client credentials");
    }

    const isValidSecret = await bcrypt.compare(
      clientSecret,
      client.clientSecretHash,
    );
    if (!isValidSecret) {
      throw new UnauthorizedException("Invalid client credentials");
    }

    // Find and delete token
    const tokens = await this.accessTokenRepository.find({
      where: { clientId },
    });

    for (const tokenEntity of tokens) {
      const isMatch = await bcrypt.compare(token, tokenEntity.tokenHash);
      if (isMatch) {
        await this.accessTokenRepository.remove(tokenEntity);
        return;
      }
    }
  }

  async listClients(tenantId: string): Promise<OAuthClientResponseDto[]> {
    const clients = await this.oauthClientRepository.find({
      where: { tenantId },
      order: { createdAt: "DESC" },
    });

    return clients.map((client) => ({
      id: client.id,
      clientId: client.clientId,
      name: client.name,
      description: client.description,
      redirectUris: client.redirectUris,
      scopes: client.scopes,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }

  async getClient(
    tenantId: string,
    clientId: string,
  ): Promise<OAuthClientResponseDto> {
    const client = await this.oauthClientRepository.findOne({
      where: { tenantId, id: clientId },
    });

    if (!client) {
      throw new BadRequestException("Client not found");
    }

    return {
      id: client.id,
      clientId: client.clientId,
      name: client.name,
      description: client.description,
      redirectUris: client.redirectUris,
      scopes: client.scopes,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
