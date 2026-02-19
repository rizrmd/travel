/**
 * Integration 5: E-Signature Integration
 * Entity: Signature Event
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SignatureEventType } from "../domain";

@Entity("signature_events")
@Index("idx_signature_events_tenant", ["tenantId"])
@Index("idx_signature_events_contract", ["contractId"])
@Index("idx_signature_events_request", ["signatureRequestId"])
@Index("idx_signature_events_tenant_type", ["tenantId", "eventType"])
export class SignatureEventEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @Column({ name: "contract_id", type: "uuid" })
  contractId: string;

  @Column({ name: "signature_request_id", type: "varchar", length: 100 })
  signatureRequestId: string;

  @Column({
    name: "event_type",
    type: "varchar",
    length: 50,
  })
  eventType: SignatureEventType;

  @Column({ name: "event_data", type: "jsonb", nullable: true })
  eventData: Record<string, any> | null;

  @Column({ name: "ip_address", type: "varchar", length: 50, nullable: true })
  ipAddress: string | null;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent: string | null;

  @Column({
    name: "occurred_at",
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  occurredAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  // Relations
  @ManyToOne("TenantEntity", { nullable: false })
  @JoinColumn({ name: "tenant_id" })
  tenant?: any;

  @ManyToOne("ContractEntity", { nullable: false })
  @JoinColumn({ name: "contract_id" })
  contract?: any;
}
