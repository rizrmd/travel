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
import { UserEntity } from "../../../../../users/entities/user.entity";

export enum ApiKeyEnvironmentEnum {
  PRODUCTION = "production",
  SANDBOX = "sandbox",
}

@Entity("api_keys")
@Index(["tenantId", "keyHash", "environment"])
export class ApiKeyEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ name: "key_hash", type: "varchar", length: 255, unique: true })
  @Index()
  keyHash: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({
    type: "enum",
    enum: ApiKeyEnvironmentEnum,
    default: ApiKeyEnvironmentEnum.PRODUCTION,
  })
  @Index()
  environment: ApiKeyEnvironmentEnum;

  @Column({ type: "text", array: true, default: "{}" })
  scopes: string[];

  @Column({ name: "rate_limit", type: "integer", default: 1000 })
  rateLimit: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  @Index()
  isActive: boolean;

  @Column({
    name: "last_used_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  lastUsedAt?: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @Column({
    name: "expires_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  expiresAt?: Date;
}
