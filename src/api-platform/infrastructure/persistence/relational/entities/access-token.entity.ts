import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";
import { OAuthClientEntity } from "./oauth-client.entity";

@Entity("access_tokens")
@Index(["tenantId", "tokenHash", "expiresAt"])
export class AccessTokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({ name: "client_id", type: "varchar", length: 100 })
  @Index()
  clientId: string;

  @ManyToOne(() => OAuthClientEntity)
  @JoinColumn({ name: "client_id", referencedColumnName: "clientId" })
  client: OAuthClientEntity;

  @Column({ name: "token_hash", type: "varchar", length: 255, unique: true })
  @Index()
  tokenHash: string;

  @Column({ type: "text", array: true, default: "{}" })
  scopes: string[];

  @Column({ name: "expires_at", type: "timestamp with time zone" })
  @Index()
  expiresAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;
}
