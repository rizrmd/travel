/**
 * Epic 7: Payments Module
 * Configures payment-related services and controllers
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentEntity } from "./infrastructure/persistence/relational/entities/payment.entity";
import { PaymentScheduleEntity } from "./infrastructure/persistence/relational/entities/payment-schedule.entity";
import { CommissionEntity } from "./infrastructure/persistence/relational/entities/commission.entity";
import { CommissionRulesEntity } from "./infrastructure/persistence/relational/entities/commission-rules.entity";
import { PaymentReminderEntity } from "./infrastructure/persistence/relational/entities/payment-reminder.entity";
import {
  CommissionPayoutEntity,
  CommissionPayoutItemEntity,
} from "./infrastructure/persistence/relational/entities/commission-payout.entity";
import { PaymentsService } from "./services/payments.service";
import { InstallmentService } from "./services/installment.service";
import { CommissionService } from "./services/commission.service";
import { PayoutService } from "./services/payout.service";
import { PaymentsController } from "./payments.controller";
import { CommissionsController } from "./commissions.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      PaymentScheduleEntity,
      CommissionEntity,
      CommissionRulesEntity,
      PaymentReminderEntity,
      CommissionPayoutEntity,
      CommissionPayoutItemEntity,
    ]),
  ],
  providers: [
    PaymentsService,
    InstallmentService,
    CommissionService,
    PayoutService,
  ],
  controllers: [PaymentsController, CommissionsController],
  exports: [
    PaymentsService,
    InstallmentService,
    CommissionService,
    PayoutService,
  ],
})
export class PaymentsModule {}
