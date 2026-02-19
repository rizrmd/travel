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
import { ApiKeyEntity } from "./api-key.entity";

export enum WebhookEventEnum {
  PAYMENT_CONFIRMED = "payment.confirmed",
  PAYMENT_FAILED = "payment.failed",
  JAMAAH_CREATED = "jamaah.created",
  JAMAAH_UPDATED = "jamaah.updated",
  JAMAAH_DELETED = "jamaah.deleted",
  PACKAGE_UPDATED = "package.updated",
  DOCUMENT_APPROVED = "document.approved",
  DOCUMENT_REJECTED = "document.rejected",
  CONTRACT_SIGNED = "contract.signed",
}

@Entity("webhook_subscriptions")
@Index(["tenantId", "isActive"])
export class WebhookSubscriptionEntity {
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

  @Column({ type: "varchar", length: 500 })
  url: string;

  @Column({
    type: "enum",
    enum: WebhookEventEnum,
    array: true,
  })
  events: WebhookEventEnum[];

  @Column({ type: "varchar", length: 255 })
  secret: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;
}
