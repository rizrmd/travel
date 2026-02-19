import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";

@Entity("oauth_clients")
@Index(["tenantId", "clientId", "isActive"])
export class OAuthClientEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({ name: "client_id", type: "varchar", length: 100, unique: true })
  @Index()
  clientId: string;

  @Column({ name: "client_secret_hash", type: "varchar", length: 255 })
  clientSecretHash: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "redirect_uris", type: "text", array: true, default: "{}" })
  redirectUris: string[];

  @Column({ type: "text", array: true, default: "{}" })
  scopes: string[];

  @Column({ name: "is_active", type: "boolean", default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
