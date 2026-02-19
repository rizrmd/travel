/**
 * Epic 7, Story 7.2: Installment Service
 * Handles payment schedule creation and management
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { PaymentScheduleEntity } from "../infrastructure/persistence/relational/entities/payment-schedule.entity";
import { CreatePaymentScheduleDto } from "../dto/create-payment-schedule.dto";
import { PaymentScheduleResponseDto } from "../dto/payment-schedule-response.dto";
import { PaymentSchedule, ScheduleStatus } from "../domain/payment-schedule";

@Injectable()
export class InstallmentService {
  constructor(
    @InjectRepository(PaymentScheduleEntity)
    private readonly scheduleRepository: Repository<PaymentScheduleEntity>,
  ) {}

  /**
   * Create payment schedule for a jamaah
   * Story 7.2: Installment tracking system
   */
  async createSchedule(
    dto: CreatePaymentScheduleDto,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto[]> {
    // Validate inputs
    if (dto.dpAmount >= dto.packagePrice) {
      throw new BadRequestException("Down payment cannot exceed package price");
    }

    // Generate schedule using domain logic
    const schedules = PaymentSchedule.generateSchedule(
      dto.packagePrice,
      dto.dpAmount,
      dto.installmentCount,
      new Date(dto.startDate),
    );

    // Create entities
    const entities = schedules.map((schedule) =>
      this.scheduleRepository.create({
        tenant_id: tenantId,
        jamaah_id: dto.jamaahId,
        installment_number: schedule.installmentNumber,
        due_date: schedule.dueDate,
        amount: schedule.amount,
        status: schedule.status,
        paid_at: schedule.paidAt,
        payment_id: schedule.paymentId,
      }),
    );

    const saved = await this.scheduleRepository.save(entities);

    return saved.map((e) => this.mapToResponseDto(e));
  }

  /**
   * Get all schedules for a jamaah
   */
  async findByJamaah(
    jamaahId: string,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: {
        jamaah_id: jamaahId,
        tenant_id: tenantId,
      },
      order: {
        installment_number: "ASC",
      },
    });

    return schedules.map((s) => this.mapToResponseDto(s));
  }

  /**
   * Get schedule by ID
   */
  async findOne(
    id: string,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.mapToResponseDto(schedule);
  }

  /**
   * Record payment for an installment
   */
  async recordPayment(
    id: string,
    paymentId: string,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    const domain = this.mapToDomain(schedule);

    if (!domain.canRecordPayment()) {
      throw new BadRequestException(
        `Cannot record payment for installment with status: ${schedule.status}`,
      );
    }

    domain.recordPayment(paymentId);

    schedule.status = domain.status;
    schedule.payment_id = domain.paymentId;
    schedule.paid_at = domain.paidAt;
    schedule.updated_at = domain.updatedAt;

    const updated = await this.scheduleRepository.save(schedule);

    return this.mapToResponseDto(updated);
  }

  /**
   * Mark overdue schedules (cron job)
   * Story 7.2: Daily cron to mark overdue installments
   */
  async markOverdueSchedules(tenantId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueSchedules = await this.scheduleRepository.find({
      where: {
        tenant_id: tenantId,
        status: ScheduleStatus.PENDING,
        due_date: LessThan(today),
      },
    });

    for (const schedule of overdueSchedules) {
      const domain = this.mapToDomain(schedule);
      if (domain.isOverdue()) {
        domain.markAsOverdue();
        schedule.status = domain.status;
        schedule.updated_at = domain.updatedAt;
      }
    }

    await this.scheduleRepository.save(overdueSchedules);

    return overdueSchedules.length;
  }

  /**
   * Get schedules due soon (for reminder scheduling)
   * Story 7.3: Find installments due in 3 days
   */
  async getSchedulesDueSoon(
    daysAhead: number,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const schedules = await this.scheduleRepository
      .createQueryBuilder("schedule")
      .where("schedule.tenant_id = :tenantId", { tenantId })
      .andWhere("schedule.status = :status", { status: ScheduleStatus.PENDING })
      .andWhere("schedule.due_date >= :targetDate", { targetDate })
      .andWhere("schedule.due_date < :nextDay", { nextDay })
      .getMany();

    return schedules.map((s) => this.mapToResponseDto(s));
  }

  /**
   * Find next unpaid installment for a jamaah
   */
  async findNextUnpaid(
    jamaahId: string,
    tenantId: string,
  ): Promise<PaymentScheduleResponseDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        jamaah_id: jamaahId,
        tenant_id: tenantId,
        status: ScheduleStatus.PENDING,
      },
      order: {
        installment_number: "ASC",
      },
    });

    return schedule ? this.mapToResponseDto(schedule) : null;
  }

  /**
   * Get payment progress summary
   */
  async getPaymentProgress(
    jamaahId: string,
    tenantId: string,
  ): Promise<{
    totalSchedules: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    completionPercentage: number;
  }> {
    const schedules = await this.scheduleRepository.find({
      where: {
        jamaah_id: jamaahId,
        tenant_id: tenantId,
      },
    });

    const totalSchedules = schedules.length;
    const paidCount = schedules.filter(
      (s) => s.status === ScheduleStatus.PAID,
    ).length;
    const pendingCount = schedules.filter(
      (s) => s.status === ScheduleStatus.PENDING,
    ).length;
    const overdueCount = schedules.filter(
      (s) => s.status === ScheduleStatus.OVERDUE,
    ).length;

    const totalAmount = schedules.reduce(
      (sum, s) => sum + parseFloat(s.amount.toString()),
      0,
    );
    const paidAmount = schedules
      .filter((s) => s.status === ScheduleStatus.PAID)
      .reduce((sum, s) => sum + parseFloat(s.amount.toString()), 0);
    const remainingAmount = totalAmount - paidAmount;
    const completionPercentage =
      totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

    return {
      totalSchedules,
      paidCount,
      pendingCount,
      overdueCount,
      totalAmount,
      paidAmount,
      remainingAmount,
      completionPercentage,
    };
  }

  /**
   * Map entity to domain model
   */
  private mapToDomain(entity: PaymentScheduleEntity): PaymentSchedule {
    return new PaymentSchedule({
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      installmentNumber: entity.installment_number,
      dueDate: entity.due_date,
      amount: parseFloat(entity.amount.toString()),
      status: entity.status,
      paidAt: entity.paid_at,
      paymentId: entity.payment_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(
    entity: PaymentScheduleEntity,
  ): PaymentScheduleResponseDto {
    const domain = this.mapToDomain(entity);

    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      installmentNumber: entity.installment_number,
      dueDate: entity.due_date,
      amount: parseFloat(entity.amount.toString()),
      status: entity.status,
      paidAt: entity.paid_at,
      paymentId: entity.payment_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      formattedAmount: domain.getFormattedAmount(),
      formattedDueDate: domain.getFormattedDueDate(),
      statusDisplay: domain.getStatusDisplay(),
      statusColor: domain.getStatusColor(),
      daysUntilDue: domain.getDaysUntilDue(),
      isDueSoon: domain.isDueSoon(),
      isOverdue: domain.isOverdue(),
    };
  }
}
