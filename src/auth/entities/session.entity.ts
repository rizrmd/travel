import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

/**
 * Session Entity - TypeORM
 * Stores refresh tokens for JWT authentication
 */
@Entity("sessions")
@Index(["userId"])
@Index(["refreshToken"], { unique: true })
@Index(["expiresAt"])
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  @Index()
  tenantId: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  // Refresh Token
  @Column({ type: "varchar", length: 500, name: "refresh_token" })
  refreshToken: string;

  @Column({ type: "timestamp", name: "expires_at" })
  expiresAt: Date;

  // Session Metadata
  @Column({ type: "varchar", length: 50, nullable: true, name: "ip_address" })
  ipAddress?: string;

  @Column({ type: "text", nullable: true, name: "user_agent" })
  userAgent?: string;

  @Column({ type: "boolean", default: true, name: "is_active" })
  isActive: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
    name: "revoked_at",
  })
  revokedAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
