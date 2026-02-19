/**
 * Epic 9, Story 9.1: Chatbot Module
 * Placeholder module for Phase 2 AI chatbot
 */

import { Module } from "@nestjs/common";
import { ChatbotController } from "./chatbot.controller";

@Module({
  controllers: [ChatbotController],
  providers: [],
  exports: [],
})
export class ChatbotModule {}
