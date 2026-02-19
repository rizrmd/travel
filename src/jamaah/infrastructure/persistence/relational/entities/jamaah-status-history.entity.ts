/**
 * Epic 5, Story 5.1: Jamaah Status History Entity
 * TypeORM entity for tracking status transitions
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
import { JamaahStatus } from "../../../../domain/jamaah";
import { JamaahEntity } from "./jamaah.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "jamaah_status_history" })
@Index(["tenant_id", "jamaah_id", "created_at"])
@Index(["tenant_id", "created_at"])
export class JamaahStatusHistoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @ManyToOne(() => JamaahEntity, (jamaah) => jamaah.status_history)
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity;

  @Column({
    type: "enum",
    enum: JamaahStatus,
    nullable: false,
  })
  from_status: JamaahStatus;

  @Column({
    type: "enum",
    enum: JamaahStatus,
    nullable: false,
  })
  to_status: JamaahStatus;

  @Column({ type: "uuid", nullable: false })
  changed_by_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "changed_by_id" })
  changed_by: UserEntity;

  @Column({ type: "text", nullable: true })
  reason: string | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
