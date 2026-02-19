/**
 * Integration 5: E-Signature Integration
 * Service: Signature Event Tracker
 */

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignatureEventEntity } from "../entities/signature-event.entity";
import { SignatureEventType } from "../domain";

@Injectable()
export class SignatureTrackerService {
  private readonly logger = new Logger(SignatureTrackerService.name);

  constructor(
    @InjectRepository(SignatureEventEntity)
    private readonly eventRepository: Repository<SignatureEventEntity>,
  ) {}

  /**
   * Log a signature event
   */
  async logEvent(
    tenantId: string,
    contractId: string,
    signatureRequestId: string,
    eventType: SignatureEventType,
    eventData?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<SignatureEventEntity> {
    const event = this.eventRepository.create({
      tenantId,
      contractId,
      signatureRequestId,
      eventType,
      eventData: eventData || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      occurredAt: new Date(),
    });

    const saved = await this.eventRepository.save(event);

    this.logger.log(
      `Signature event logged: ${eventType} for contract ${contractId} (request: ${signatureRequestId})`,
    );

    return saved;
  }

  /**
   * Get all events for a contract
   */
  async getContractEvents(contractId: string): Promise<SignatureEventEntity[]> {
    return await this.eventRepository.find({
      where: { contractId },
      order: { occurredAt: "ASC" },
    });
  }

  /**
   * Get events for a signature request
   */
  async getSignatureRequestEvents(
    signatureRequestId: string,
  ): Promise<SignatureEventEntity[]> {
    return await this.eventRepository.find({
      where: { signatureRequestId },
      order: { occurredAt: "ASC" },
    });
  }

  /**
   * Get recent events for tenant
   */
  async getRecentEvents(
    tenantId: string,
    limit: number = 50,
  ): Promise<SignatureEventEntity[]> {
    return await this.eventRepository.find({
      where: { tenantId },
      order: { occurredAt: "DESC" },
      take: limit,
    });
  }

  /**
   * Get event statistics for a tenant
   */
  async getEventStatistics(
    tenantId: string,
  ): Promise<Record<SignatureEventType, number>> {
    const events = await this.eventRepository
      .createQueryBuilder("event")
      .select("event.event_type", "eventType")
      .addSelect("COUNT(*)", "count")
      .where("event.tenant_id = :tenantId", { tenantId })
      .groupBy("event.event_type")
      .getRawMany();

    const statistics: Record<string, number> = {};

    // Initialize all event types with 0
    Object.values(SignatureEventType).forEach((type) => {
      statistics[type] = 0;
    });

    // Fill in actual counts
    events.forEach((event) => {
      statistics[event.eventType] = parseInt(event.count, 10);
    });

    return statistics as Record<SignatureEventType, number>;
  }

  /**
   * Check if specific event type occurred for a signature request
   */
  async hasEventOccurred(
    signatureRequestId: string,
    eventType: SignatureEventType,
  ): Promise<boolean> {
    const count = await this.eventRepository.count({
      where: {
        signatureRequestId,
        eventType,
      },
    });

    return count > 0;
  }
}
