import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AnomalyDetectionEntity } from "./anomaly-detection.entity";

/**
 * Alert Entity
 *
 * Stores alert notifications (NO RLS - super admin only)
 */
export enum AlertChannel {
  EMAIL = "email",
  SLACK = "slack",
  SMS = "sms",
}

export enum AlertStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  ACKNOWLEDGED = "acknowledged",
}

@Entity("alerts")
@Index(["anomalyId", "status", "sentAt"])
@Index(["status", "sentAt"])
export class AlertEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    name: "anomaly_id",
  })
  anomalyId: string;

  @ManyToOne(() => AnomalyDetectionEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "anomaly_id" })
  anomaly: AnomalyDetectionEntity;

  @Column({
    type: "varchar",
    length: 20,
  })
  channel: AlertChannel;

  @Column({
    type: "varchar",
    length: 255,
  })
  recipient: string;

  @Column({
    type: "varchar",
    length: 20,
    default: AlertStatus.PENDING,
  })
  status: AlertStatus;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    name: "sent_at",
    nullable: true,
  })
  sentAt: Date | null;

  @Column({
    type: "timestamp",
    name: "acknowledged_at",
    nullable: true,
  })
  acknowledgedAt: Date | null;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
  })
  createdAt: Date;
}
