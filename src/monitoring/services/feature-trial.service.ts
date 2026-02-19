import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FeatureTrialEntity } from "../infrastructure/persistence/relational/entities/feature-trial.entity";
import { FeatureTrial, FeatureKey, TrialStatus } from "../domain/feature-trial";
import { Logger } from "../../config/winston.config";

@Injectable()
export class FeatureTrialService {
  private readonly logger = new Logger("FeatureTrialService");

  constructor(
    @InjectRepository(FeatureTrialEntity)
    private readonly trialRepository: Repository<FeatureTrialEntity>,
  ) {}

  async enableTrial(
    tenantId: string,
    featureKey: FeatureKey,
    durationDays?: number,
  ): Promise<FeatureTrial> {
    const existing = await this.trialRepository.findOne({
      where: { tenantId, featureKey, status: TrialStatus.ACTIVE },
    });

    if (existing) {
      throw new Error("Active trial already exists for this feature");
    }

    const trial = FeatureTrial.createTrial(tenantId, featureKey, durationDays);

    const entity = new FeatureTrialEntity();
    entity.tenantId = trial.tenantId;
    entity.featureKey = trial.featureKey;
    entity.status = trial.status;
    entity.startedAt = trial.startedAt;
    entity.expiresAt = trial.expiresAt;
    entity.usageCount = trial.usageCount;
    entity.usageLimit = trial.usageLimit;

    await this.trialRepository.save(entity);

    this.logger.info("Trial enabled", {
      tenantId,
      featureKey,
      expiresAt: trial.expiresAt,
    });
    return trial;
  }

  async trackUsage(tenantId: string, featureKey: FeatureKey): Promise<boolean> {
    const entity = await this.trialRepository.findOne({
      where: { tenantId, featureKey, status: TrialStatus.ACTIVE },
    });

    if (!entity) return false;

    const trial = new FeatureTrial(
      entity.tenantId,
      entity.featureKey,
      entity.status,
      entity.startedAt,
      entity.expiresAt,
      entity.usageCount,
      entity.usageLimit,
    );

    const result = trial.trackUsage();

    if (result.success) {
      entity.usageCount = trial.usageCount;
      entity.status = trial.status;
      await this.trialRepository.save(entity);
    }

    return result.success;
  }

  async checkTrialStatus(
    tenantId: string,
    featureKey: FeatureKey,
  ): Promise<boolean> {
    const entity = await this.trialRepository.findOne({
      where: { tenantId, featureKey },
      order: { startedAt: "DESC" },
    });

    if (!entity) return false;

    const trial = new FeatureTrial(
      entity.tenantId,
      entity.featureKey,
      entity.status,
      entity.startedAt,
      entity.expiresAt,
      entity.usageCount,
      entity.usageLimit,
    );

    return trial.isActive();
  }

  async getExpiringSoon(): Promise<FeatureTrial[]> {
    const entities = await this.trialRepository.find({
      where: { status: TrialStatus.ACTIVE },
    });

    return entities
      .map(
        (e) =>
          new FeatureTrial(
            e.tenantId,
            e.featureKey,
            e.status,
            e.startedAt,
            e.expiresAt,
            e.usageCount,
            e.usageLimit,
          ),
      )
      .filter((t) => t.isExpiringSoon());
  }

  async sendExpiryNotification(trial: FeatureTrial): Promise<void> {
    this.logger.info("Trial expiry notification sent", {
      tenantId: trial.tenantId,
      feature: trial.featureKey,
      daysRemaining: trial.getDaysRemaining(),
    });
  }

  async convertTrial(trialId: string, feedback?: string): Promise<void> {
    await this.trialRepository.update(trialId, {
      status: TrialStatus.CONVERTED,
      convertedAt: new Date(),
      trialFeedback: feedback || null,
    });
  }

  async cancelTrial(trialId: string, feedback?: string): Promise<void> {
    await this.trialRepository.update(trialId, {
      status: TrialStatus.CANCELLED,
      trialFeedback: feedback || null,
    });
  }

  async extendTrial(trialId: string, additionalDays: number): Promise<void> {
    const entity = await this.trialRepository.findOne({
      where: { id: trialId },
    });
    if (!entity) throw new Error("Trial not found");

    const trial = new FeatureTrial(
      entity.tenantId,
      entity.featureKey,
      entity.status,
      entity.startedAt,
      entity.expiresAt,
      entity.usageCount,
      entity.usageLimit,
    );

    trial.extend(additionalDays);

    entity.expiresAt = trial.expiresAt;
    entity.status = trial.status;

    await this.trialRepository.save(entity);
  }
}
