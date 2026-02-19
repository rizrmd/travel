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
import {
  TemplateType,
  LandingPageStatus,
  LandingPageCustomizations,
} from "../../../../domain/landing-page";

/**
 * Epic 10, Story 10.1: Landing Page Entity
 * TypeORM entity for agent-generated landing pages
 */
@Entity({ name: "landing_pages" })
@Index(["tenantId", "agentId"])
@Index(["slug"], { unique: true })
@Index(["status", "publishedAt"])
export class LandingPageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  @Index()
  tenantId: string;

  @Column({ type: "uuid", name: "agent_id" })
  @Index()
  agentId: string;

  @Column({ type: "uuid", name: "package_id" })
  @Index()
  packageId: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({
    type: "enum",
    enum: TemplateType,
    name: "template_id",
    default: TemplateType.MODERN,
  })
  templateId: TemplateType;

  @Column({ type: "jsonb", default: {} })
  customizations: LandingPageCustomizations;

  @Column({
    type: "enum",
    enum: LandingPageStatus,
    default: LandingPageStatus.DRAFT,
  })
  status: LandingPageStatus;

  @Column({ type: "int", name: "views_count", default: 0 })
  viewsCount: number;

  @Column({ type: "int", name: "leads_count", default: 0 })
  leadsCount: number;

  @Column({ type: "timestamp", name: "published_at", nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date | null;
}
