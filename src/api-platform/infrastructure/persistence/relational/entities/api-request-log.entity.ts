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
import { ApiKeyEntity } from "./api-key.entity";

@Entity("api_request_logs")
@Index(["tenantId", "apiKeyId", "createdAt"])
@Index(["createdAt"])
export class ApiRequestLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({ name: "api_key_id", type: "uuid" })
  @Index()
  apiKeyId: string;

  @ManyToOne(() => ApiKeyEntity)
  @JoinColumn({ name: "api_key_id" })
  apiKey: ApiKeyEntity;

  @Column({ type: "varchar", length: 255 })
  endpoint: string;

  @Column({ type: "varchar", length: 10 })
  method: string;

  @Column({ name: "status_code", type: "integer" })
  statusCode: number;

  @Column({ name: "response_time_ms", type: "integer" })
  responseTimeMs: number;

  @Column({ name: "ip_address", type: "varchar", length: 45, nullable: true })
  ipAddress?: string;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  @Index()
  createdAt: Date;
}
