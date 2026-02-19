/**
 * Epic 5, Story 5.5: Jamaah Action Log Entity
 * TypeORM entity for audit trail of agent actions
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
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  ActionType,
  PerformedByRole,
} from "../../../../domain/jamaah-action-log";
import { JamaahEntity } from "./jamaah.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "jamaah_action_logs" })
@Index(["tenant_id", "created_at"])
@Index(["tenant_id", "jamaah_id", "created_at"])
@Index(["tenant_id", "performed_by_id", "created_at"])
@Index(["action_type"])
export class JamaahActionLogEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @ManyToOne(() => JamaahEntity, (jamaah) => jamaah.action_logs)
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity;

  @Column({
    type: "enum",
    enum: ActionType,
    nullable: false,
  })
  action_type: ActionType;

  @Column({ type: "text", nullable: false })
  action_description: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  performed_by_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "performed_by_id" })
  performed_by: UserEntity;

  @Column({
    type: "enum",
    enum: PerformedByRole,
    nullable: false,
  })
  performed_by_role: PerformedByRole;

  @Column({ type: "jsonb", nullable: true })
  old_value: Record<string, any> | null;

  @Column({ type: "jsonb", nullable: true })
  new_value: Record<string, any> | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: "varchar", length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  user_agent: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
