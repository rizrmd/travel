/**
 * Epic 12, Story 12.2: Signature Entity
 * E-signature tracking with RLS
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import {
  SignatureStatus,
  SignerType,
  SignatureProvider,
  SignatureEvent,
} from "../../../../domain/signature";

@Entity("signatures")
@Index("idx_signatures_tenant_contract", ["tenantId", "contractId"])
@Index("idx_signatures_tenant_status", ["tenantId", "status"])
@Index("idx_signatures_sent_at", ["sentAt"])
@Index("idx_signatures_provider_envelope", [
  "signatureProvider",
  "providerEnvelopeId",
])
export class SignatureEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @Column({ name: "contract_id", type: "uuid" })
  contractId: string;

  @Column({
    name: "signer_type",
    type: "enum",
    enum: SignerType,
  })
  signerType: SignerType;

  @Column({ name: "signer_id", type: "uuid" })
  signerId: string;

  @Column({ name: "signer_name", type: "varchar", length: 255 })
  signerName: string;

  @Column({ name: "signer_email", type: "varchar", length: 255 })
  signerEmail: string;

  @Column({
    name: "signature_provider",
    type: "enum",
    enum: SignatureProvider,
    default: SignatureProvider.MANUAL,
  })
  signatureProvider: SignatureProvider;

  @Column({
    name: "provider_envelope_id",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  providerEnvelopeId: string | null;

  @Column({
    type: "enum",
    enum: SignatureStatus,
    default: SignatureStatus.PENDING,
  })
  status: SignatureStatus;

  @Column({ name: "sent_at", type: "timestamp with time zone", nullable: true })
  sentAt: Date | null;

  @Column({
    name: "delivered_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  deliveredAt: Date | null;

  @Column({
    name: "viewed_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  viewedAt: Date | null;

  @Column({
    name: "signed_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  signedAt: Date | null;

  @Column({
    name: "declined_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  declinedAt: Date | null;

  @Column({
    name: "expires_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  expiresAt: Date | null;

  @Column({ name: "ip_address", type: "varchar", length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent: string | null;

  @Column({ name: "signature_image_url", type: "text", nullable: true })
  signatureImageUrl: string | null;

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>;

  @Column({ type: "jsonb", default: [] })
  events: SignatureEvent[];

  @Column({ name: "reminder_count", type: "int", default: 0 })
  reminderCount: number;

  @Column({
    name: "last_reminder_sent_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  lastReminderSentAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  // Relations
  @ManyToOne("TenantEntity", { nullable: false })
  @JoinColumn({ name: "tenant_id" })
  tenant?: any;

  @ManyToOne("ContractEntity", { nullable: false })
  @JoinColumn({ name: "contract_id" })
  contract?: any;
}
