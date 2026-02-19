/**
 * Epic 13, Story 13.4: Training Reminder Background Job
 * Sends reminders to users with incomplete mandatory training
 */

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserEntity } from "../../users/entities/user.entity";
import { TrainingMaterialEntity } from "../infrastructure/persistence/relational/entities/training-material.entity";
import { TrainingProgressEntity } from "../infrastructure/persistence/relational/entities/training-progress.entity";
import { TrainingProgressStatus } from "../domain/training-progress";

@Processor("training-reminders")
@Injectable()
export class TrainingReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(TrainingReminderProcessor.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TrainingMaterialEntity)
    private materialRepository: Repository<TrainingMaterialEntity>,
    @InjectRepository(TrainingProgressEntity)
    private progressRepository: Repository<TrainingProgressEntity>,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    // No jobs to process yet
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyReminders() {
    this.logger.log("Running daily training reminders...");

    // Get all tenants (simplified - in reality would iterate by tenant)
    const users = await this.userRepository.find({
      where: { status: "active" as any },
    });

    for (const user of users) {
      await this.checkAndSendReminder(user);
    }
  }

  private async checkAndSendReminder(user: UserEntity) {
    // Get mandatory materials for tenant
    const mandatoryMaterials = await this.materialRepository.find({
      where: {
        tenant_id: user.tenantId,
        is_mandatory: true,
        is_published: true,
      },
    });

    if (mandatoryMaterials.length === 0) return;

    // Get user's progress
    const completedProgress = await this.progressRepository.count({
      where: {
        tenant_id: user.tenantId,
        user_id: user.id,
        status: TrainingProgressStatus.COMPLETED,
      },
    });

    // If not all mandatory materials completed, send reminder
    if (completedProgress < mandatoryMaterials.length) {
      await this.sendReminderEmail(
        user,
        mandatoryMaterials.length - completedProgress,
      );
    }
  }

  private async sendReminderEmail(user: UserEntity, remainingCount: number) {
    // Email sending logic would go here
    this.logger.log(
      `Sending training reminder to ${user.email} - ${remainingCount} materials remaining`,
    );
  }
}
