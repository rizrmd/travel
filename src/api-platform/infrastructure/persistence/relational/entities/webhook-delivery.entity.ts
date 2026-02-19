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
import { WebhookSubscriptionEntity } from "./webhook-subscription.entity";

export enum WebhookDeliveryStatusEnum {
  PENDING = "pending",
  DELIVERED = "delivered",
  FAILED = "failed",
  MAX_RETRIES_EXCEEDED = "max_retries_exceeded",
}

@Entity("webhook_deliveries")
@Index(["tenantId", "subscriptionId", "status", "createdAt"])
@Index(["status", "nextRetryAt"])
export class WebhookDeliveryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity)
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({ name: "subscription_id", type: "uuid" })
  @Index()
  subscriptionId: string;

  @ManyToOne(() => WebhookSubscriptionEntity)
  @JoinColumn({ name: "subscription_id" })
  subscription: WebhookSubscriptionEntity;

  @Column({ name: "event_type", type: "varchar", length: 100 })
  eventType: string;

  @Column({ type: "jsonb" })
  payload: any;

  @Column({
    type: "enum",
    enum: WebhookDeliveryStatusEnum,
    default: WebhookDeliveryStatusEnum.PENDING,
  })
  @Index()
  status: WebhookDeliveryStatusEnum;

  @Column({ name: "http_status", type: "integer", nullable: true })
  httpStatus?: number;

  @Column({ name: "response_body", type: "text", nullable: true })
  responseBody?: string;

  @Column({ name: "attempt_count", type: "integer", default: 0 })
  attemptCount: number;

  @Column({
    name: "next_retry_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  @Index()
  nextRetryAt?: Date;

  @Column({
    name: "delivered_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  deliveredAt?: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  @Index()
  createdAt: Date;
}
