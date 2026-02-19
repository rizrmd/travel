/**
 * Epic 12, Story 12.1: Contract Entity
 * Database schema for Wakalah bil Ujrah contracts with RLS
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
import { ContractStatus, ContractType, SignatureStatus } from "../../../../domain/contract";

@Entity("contracts")
@Index("idx_contracts_tenant_jamaah", ["tenantId", "jamaahId"])
@Index("idx_contracts_tenant_status", ["tenantId", "status"])
@Index("idx_contracts_contract_number", ["contractNumber"], { unique: true })
@Index("idx_contracts_sent_at", ["sentAt"])
export class ContractEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @Column({ name: "jamaah_id", type: "uuid" })
  jamaahId: string;

  @Column({ name: "package_id", type: "uuid" })
  packageId: string;

  @Column({
    name: "contract_type",
    type: "enum",
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({
    name: "contract_number",
    type: "varchar",
    length: 50,
    unique: true,
  })
  contractNumber: string;

  @Column({
    name: "template_version",
    type: "varchar",
    length: 20,
    default: "1.0",
  })
  templateVersion: string;

  @Column({
    type: "enum",
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ name: "generated_at", type: "timestamp with time zone" })
  generatedAt: Date;

  @Column({ name: "sent_at", type: "timestamp with time zone", nullable: true })
  sentAt: Date | null;

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
    name: "completed_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  completedAt: Date | null;

  @Column({
    name: "expires_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  expiresAt: Date | null;

  @Column({ name: "contract_url", type: "text", nullable: true })
  contractUrl: string | null;

  @Column({ name: "signature_status", type: "varchar", length: 50, nullable: true })
  signatureStatus: SignatureStatus | null;

  @Column({ name: "signature_request_id", type: "varchar", length: 100, nullable: true })
  signatureRequestId: string | null;

  @Column({ name: "signature_url", type: "text", nullable: true })
  signatureUrl: string | null;

  @Column({ name: "signed_document_url", type: "text", nullable: true })
  signedDocumentUrl: string | null;

  @Column({ name: "signature_certificate_url", type: "text", nullable: true })
  signatureCertificateUrl: string | null;

  @Column({ name: "signer_email", type: "varchar", length: 255, nullable: true })
  signerEmail: string | null;

  @Column({ name: "signer_phone", type: "varchar", length: 50, nullable: true })
  signerPhone: string | null;

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  // Relations
  @ManyToOne("TenantEntity", { nullable: false })
  @JoinColumn({ name: "tenant_id" })
  tenant?: any;

  @ManyToOne("JamaahEntity", { nullable: false })
  @JoinColumn({ name: "jamaah_id" })
  jamaah?: any;

  @ManyToOne("PackageEntity", { nullable: false })
  @JoinColumn({ name: "package_id" })
  package?: any;
}
