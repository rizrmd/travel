import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { LeadStatus, LeadSource } from "../../../../domain/lead";

/**
 * Epic 10, Story 10.5: Lead Capture Form
 * TypeORM entity for leads captured from landing pages
 */
@Entity({ name: "leads" })
@Index(["tenantId", "agentId"])
@Index(["status", "createdAt"])
export class LeadEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  @Index()
  tenantId: string;

  @Column({ type: "uuid", name: "landing_page_id", nullable: true })
  @Index()
  landingPageId: string | null;

  @Column({ type: "uuid", name: "agent_id" })
  @Index()
  agentId: string;

  @Column({ type: "varchar", length: 255, name: "full_name" })
  fullName: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  email: string;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({
    type: "varchar",
    length: 50,
    name: "preferred_departure_month",
    nullable: true,
  })
  preferredDepartureMonth: string | null;

  @Column({ type: "text", nullable: true })
  message: string | null;

  @Column({
    type: "enum",
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  @Index()
  status: LeadStatus;

  @Column({
    type: "enum",
    enum: LeadSource,
    default: LeadSource.LANDING_PAGE,
  })
  source: LeadSource;

  @Column({ type: "varchar", length: 100, name: "utm_source", nullable: true })
  utmSource: string | null;

  @Column({ type: "varchar", length: 100, name: "utm_medium", nullable: true })
  utmMedium: string | null;

  @Column({
    type: "varchar",
    length: 100,
    name: "utm_campaign",
    nullable: true,
  })
  utmCampaign: string | null;

  @Column({ type: "varchar", length: 45, name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column({ type: "varchar", length: 500, name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column({
    type: "uuid",
    name: "converted_to_jamaah_id",
    nullable: true,
  })
  convertedToJamaahId: string | null;

  @Column({ type: "uuid", name: "assigned_to_agent_id", nullable: true })
  assignedToAgentId: string | null;

  @Column({
    type: "timestamp",
    name: "last_contacted_at",
    nullable: true,
  })
  lastContactedAt: Date | null;

  @Column({ type: "timestamp", name: "converted_at", nullable: true })
  convertedAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;
}
