import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  ColorScheme,
  SocialMediaLinks,
} from "../../../../domain/agent-branding";

/**
 * Epic 10, Story 10.3: Agent Branding Customization
 * TypeORM entity for agent personal branding settings
 */
@Entity({ name: "agent_branding" })
export class AgentBrandingEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", unique: true })
  userId: string;

  @Column({ type: "uuid", name: "tenant_id" })
  @Index()
  tenantId: string;

  @Column({
    type: "varchar",
    length: 500,
    name: "profile_photo",
    nullable: true,
  })
  profilePhoto: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  logo: string | null;

  @Column({ type: "varchar", length: 255, name: "agent_name" })
  agentName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  tagline: string | null;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 20, name: "whatsapp_number" })
  whatsappNumber: string;

  @Column({
    type: "jsonb",
    name: "color_scheme",
    default: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
    },
  })
  colorScheme: ColorScheme;

  @Column({
    type: "jsonb",
    name: "social_media_links",
    default: {},
  })
  socialMediaLinks: SocialMediaLinks;

  @Column({ type: "text", name: "intro_text", nullable: true })
  introText: string | null;

  @Column({
    type: "varchar",
    length: 500,
    name: "intro_video_url",
    nullable: true,
  })
  introVideoUrl: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
