import { Module } from "@nestjs/common";
import { WhatsAppController } from "./whatsapp.controller";

/**
 * Epic 9, Story 9.2: WhatsApp Integration Stub Module
 * Placeholder module for Phase 2 WhatsApp Business API integration
 */
@Module({
  controllers: [WhatsAppController],
  providers: [],
  exports: [],
})
export class WhatsAppModule {}
