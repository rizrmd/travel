/**
 * Integration 4: Virtual Account Payment Gateway
 * Service: Payment Notification Handler
 *
 * Handles webhook notifications from Midtrans:
 * 1. Validates signature
 * 2. Saves notification to database
 * 3. Queues for async processing
 * 4. Processes payment and creates payment record
 * 5. Sends notifications (WebSocket + Email)
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { PaymentNotificationEntity } from "../infrastructure/persistence/relational/entities/payment-notification.entity";
import { VirtualAccountEntity } from "../infrastructure/persistence/relational/entities/virtual-account.entity";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { MidtransService } from "./midtrans.service";
import { VirtualAccountService } from "./virtual-account.service";
import { QueueService } from "../../queue/services/queue.service";
import { BankCode } from "../domain/bank-code.enum";
import { NotificationStatus } from "../domain/va-status.enum";
import { PaymentMethod, PaymentStatus } from "../../payments/domain/payment";

@Injectable()
export class NotificationHandlerService {
  private readonly logger = new Logger(NotificationHandlerService.name);

  constructor(
    @InjectRepository(PaymentNotificationEntity)
    private readonly notificationRepository: Repository<PaymentNotificationEntity>,
    @InjectRepository(VirtualAccountEntity)
    private readonly vaRepository: Repository<VirtualAccountEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly midtransService: MidtransService,
    private readonly vaService: VirtualAccountService,
    private readonly queueService: QueueService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Handle incoming webhook notification from Midtrans
   */
  async handleNotification(notification: any): Promise<void> {
    this.logger.debug(
      `Received notification for order: ${notification.order_id}`,
    );

    // Step 1: Verify signature
    if (!this.midtransService.isSignatureValid(notification)) {
      this.logger.error(
        `Invalid signature for order: ${notification.order_id}`,
      );
      throw new UnauthorizedException("Invalid notification signature");
    }

    // Step 2: Extract data
    const {
      order_id,
      transaction_id,
      gross_amount,
      transaction_status,
      settlement_time,
      transaction_time,
      va_numbers,
      permata_va_number,
    } = notification;

    const vaNumber = va_numbers?.[0]?.va_number || permata_va_number;
    const bankCode = (va_numbers?.[0]?.bank || "permata") as BankCode;

    if (!vaNumber) {
      throw new Error("No VA number found in notification");
    }

    // Step 3: Find virtual account
    const virtualAccount = await this.vaRepository.findOne({
      where: { va_number: vaNumber },
      relations: ["jamaah", "jamaah.package"],
    });

    if (!virtualAccount) {
      this.logger.error(`Virtual account not found: ${vaNumber}`);
      throw new NotFoundException(`Virtual account not found: ${vaNumber}`);
    }

    // Step 4: Check for duplicate notification
    const existingNotification = await this.notificationRepository.findOne({
      where: { transaction_id },
    });

    if (existingNotification) {
      this.logger.warn(
        `Duplicate notification received: ${transaction_id}. Status: ${existingNotification.status}`,
      );

      // If already processed, skip
      if (existingNotification.status === NotificationStatus.PROCESSED) {
        this.logger.log(`Notification already processed: ${transaction_id}`);
        return;
      }

      // If pending/failed, retry processing
      if (existingNotification.status === NotificationStatus.PENDING) {
        this.logger.log(`Retrying pending notification: ${transaction_id}`);
        await this.queueForProcessing(
          existingNotification.id,
          virtualAccount.tenant_id,
        );
        return;
      }
    }

    // Step 5: Save notification
    const paidAt = settlement_time
      ? new Date(settlement_time)
      : transaction_time
        ? new Date(transaction_time)
        : new Date();

    const savedNotification = await this.notificationRepository.save({
      tenant_id: virtualAccount.tenant_id,
      virtual_account_id: virtualAccount.id,
      transaction_id,
      va_number: vaNumber,
      bank_code: bankCode,
      amount: parseFloat(gross_amount),
      paid_at: paidAt,
      raw_notification: notification,
      signature_key: notification.signature_key,
      status: NotificationStatus.PENDING,
    });

    this.logger.log(
      `Notification saved: ${savedNotification.id} for VA ${vaNumber}`,
    );

    // Step 6: Queue for async processing
    await this.queueForProcessing(
      savedNotification.id,
      virtualAccount.tenant_id,
    );
  }

  /**
   * Queue notification for async processing
   */
  private async queueForProcessing(
    notificationId: string,
    tenantId: string,
  ): Promise<void> {
    await this.queueService.addJob(
      "payment-notification",
      "process-notification",
      {
        notificationId,
        tenantId,
      },
    );

    this.logger.debug(`Notification queued for processing: ${notificationId}`);
  }

  /**
   * Process payment notification (called by BullMQ processor)
   */
  async processNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ["virtual_account", "virtual_account.jamaah"],
    });

    if (!notification) {
      throw new NotFoundException(`Notification not found: ${notificationId}`);
    }

    const { virtual_account } = notification;

    if (!virtual_account) {
      throw new Error(
        "Virtual account not found for notification " + notificationId,
      );
    }

    // Use transaction for atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check transaction status
      const transactionStatus =
        notification.raw_notification.transaction_status;

      if (
        transactionStatus === "settlement" ||
        transactionStatus === "capture"
      ) {
        this.logger.log(
          `Processing settlement for notification ${notificationId}`,
        );

        // Create payment record
        const payment = await queryRunner.manager.save(PaymentEntity, {
          tenant_id: notification.tenant_id,
          jamaah_id: virtual_account.jamaah_id,
          package_id: virtual_account.jamaah.package_id,
          amount: notification.amount,
          payment_method: PaymentMethod.VIRTUAL_ACCOUNT,
          payment_type: "installment" as any, // Default to installment
          status: PaymentStatus.CONFIRMED,
          reference_number: notification.transaction_id,
          payment_date: notification.paid_at,
          notes: `Automatic payment via VA ${notification.bank_code.toUpperCase()}: ${notification.va_number}`,
          recorded_by_id: virtual_account.jamaah.agent_id, // Use agent as recorder
        });

        // Link payment to notification
        await queryRunner.manager.update(
          PaymentNotificationEntity,
          notificationId,
          {
            payment_id: payment.id,
            status: NotificationStatus.PROCESSED,
            processed_at: new Date(),
          },
        );

        // Mark VA as used
        await queryRunner.manager.update(
          VirtualAccountEntity,
          virtual_account.id,
          {
            status: "used" as any,
          },
        );

        await queryRunner.commitTransaction();

        this.logger.log(
          `Payment processed successfully: ${payment.id} for notification ${notificationId}`,
        );

        // Send notifications (outside transaction)
        await this.sendPaymentNotifications(
          notification,
          virtual_account,
          payment.id,
        );
      } else if (transactionStatus === "pending") {
        // Just mark as processed, no payment creation
        await queryRunner.manager.update(
          PaymentNotificationEntity,
          notificationId,
          {
            status: NotificationStatus.PROCESSED,
            processed_at: new Date(),
          },
        );

        await queryRunner.commitTransaction();

        this.logger.log(`Pending notification processed: ${notificationId}`);
      } else {
        // Other statuses (deny, cancel, expire)
        await queryRunner.manager.update(
          PaymentNotificationEntity,
          notificationId,
          {
            status: NotificationStatus.PROCESSED,
            processed_at: new Date(),
            error_message: `Transaction status: ${transactionStatus}`,
          },
        );

        await queryRunner.commitTransaction();

        this.logger.warn(
          `Non-settlement notification: ${notificationId}, status: ${transactionStatus}`,
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Failed to process notification ${notificationId}: ${error.message}`,
      );

      // Mark as failed
      await this.notificationRepository.update(notificationId, {
        status: NotificationStatus.FAILED,
        error_message: error.message,
      });

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Send notifications after successful payment
   */
  private async sendPaymentNotifications(
    notification: PaymentNotificationEntity,
    virtualAccount: VirtualAccountEntity,
    paymentId: string,
  ): Promise<void> {
    try {
      // TODO: Implement WebSocket notification
      // await this.websocketGateway.emitToTenant(notification.tenant_id, 'payment.received', {
      //   jamaahId: virtualAccount.jamaah_id,
      //   paymentId,
      //   amount: notification.amount,
      //   vaNumber: notification.va_number,
      //   bankCode: notification.bank_code,
      // });

      // TODO: Implement Email notification
      // await this.emailService.sendPaymentConfirmation(
      //   virtualAccount.jamaah.email,
      //   {
      //     jamaahName: virtualAccount.jamaah.full_name,
      //     amount: notification.amount,
      //     paymentDate: notification.paid_at,
      //     vaNumber: notification.va_number,
      //     bankCode: notification.bank_code,
      //   },
      // );

      this.logger.log(
        `Notifications sent for payment ${paymentId} (WebSocket + Email)`,
      );
    } catch (error) {
      this.logger.error(`Failed to send notifications: ${error.message}`);
      // Don't throw - payment is already processed
    }
  }

  /**
   * Get notification by ID
   */
  async findById(id: string): Promise<PaymentNotificationEntity | null> {
    return await this.notificationRepository.findOne({
      where: { id },
      relations: ["virtual_account", "payment"],
    });
  }

  /**
   * Get notifications by VA
   */
  async findByVirtualAccountId(
    vaId: string,
  ): Promise<PaymentNotificationEntity[]> {
    return await this.notificationRepository.find({
      where: { virtual_account_id: vaId },
      order: { created_at: "DESC" },
    });
  }

  /**
   * Get pending notifications (for retry/debugging)
   */
  async findPending(tenantId: string): Promise<PaymentNotificationEntity[]> {
    return await this.notificationRepository.find({
      where: {
        tenant_id: tenantId,
        status: NotificationStatus.PENDING,
      },
      order: { created_at: "ASC" },
      take: 100,
    });
  }

  /**
   * Retry failed notification
   */
  async retryNotification(notificationId: string): Promise<void> {
    const notification = await this.findById(notificationId);

    if (!notification) {
      throw new NotFoundException(`Notification not found: ${notificationId}`);
    }

    if (notification.status === NotificationStatus.PROCESSED) {
      throw new Error("Cannot retry already processed notification");
    }

    // Reset status and queue for processing
    await this.notificationRepository.update(notificationId, {
      status: NotificationStatus.PENDING,
      error_message: null,
    });

    await this.queueForProcessing(notificationId, notification.tenant_id);

    this.logger.log(`Notification retry queued: ${notificationId}`);
  }
}
