/**
 * Epic 5, Story 5.6: Jamaah Delegation Entity
 * TypeORM entity for delegation permissions
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
import { PermissionType } from "../../../../domain/jamaah-delegation";
import { JamaahEntity } from "./jamaah.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "jamaah_delegations" })
@Index(["tenant_id", "jamaah_id", "is_active"])
@Index(["tenant_id", "delegated_to_user_id"])
@Index(["is_active", "expires_at"])
export class JamaahDelegationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @ManyToOne(() => JamaahEntity, (jamaah) => jamaah.delegations)
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity;

  @Column({ type: "uuid", nullable: false })
  @Index()
  delegated_to_user_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "delegated_to_user_id" })
  delegated_to_user: UserEntity;

  @Column({ type: "uuid", nullable: false })
  delegated_by_agent_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "delegated_by_agent_id" })
  delegated_by_agent: UserEntity;

  @Column({
    type: "enum",
    enum: PermissionType,
    nullable: false,
  })
  permission_type: PermissionType;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  revoked_at: Date | null;
}
