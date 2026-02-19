import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  DiagnosticCheckType,
  DiagnosticStatus,
} from "../../../../domain/diagnostic-result";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

/**
 * Diagnostic Result Entity
 *
 * Stores diagnostic check results (NO RLS - super admin only)
 */
@Entity("diagnostic_results")
@Index(["tenantId", "checkType", "ranAt"])
@Index(["status", "ranAt"])
export class DiagnosticResultEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    name: "tenant_id",
    nullable: true,
  })
  tenantId: string | null;

  @ManyToOne(() => TenantEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity | null;

  @Column({
    type: "varchar",
    length: 50,
    name: "check_type",
  })
  checkType: DiagnosticCheckType;

  @Column({
    type: "varchar",
    length: 20,
  })
  status: DiagnosticStatus;

  @Column({
    type: "jsonb",
  })
  details: Record<string, any>;

  @Column({
    type: "int",
    name: "duration_ms",
  })
  durationMs: number;

  @Column({
    type: "uuid",
    name: "ran_by_id",
  })
  ranById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "ran_by_id" })
  ranBy: UserEntity;

  @CreateDateColumn({
    type: "timestamp",
    name: "ran_at",
  })
  ranAt: Date;
}
