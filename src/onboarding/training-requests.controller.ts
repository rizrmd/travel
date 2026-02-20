/**
 * Epic 13, Story 13.6: Training Requests Controller
 * Handles training escalation and scheduling (5 endpoints)
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { TrainingRequestService } from "./services/training-request.service";
import { CreateTrainingRequestDto } from "./dto/create-training-request.dto";
import { TrainingRequestStatus } from "./infrastructure/persistence/relational/entities/training-request.entity";
import { UserRole } from "../users/domain/user";

@Controller("onboarding/training/requests")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingRequestsController {
  constructor(private requestService: TrainingRequestService) { }

  /**
   * 1. Create training request
   * POST /api/v1/onboarding/training/requests
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async createRequest(
    @Body() dto: CreateTrainingRequestDto,
    @GetUser() user: any,
  ) {
    return await this.requestService.createRequest(user.tenantId, user.id, dto);
  }

  /**
   * 2. List training requests
   * GET /api/v1/onboarding/training/requests
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async listRequests(
    @GetUser() user: any,
    @Query("status") status?: TrainingRequestStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const userId = user.role === "agent" ? user.id : undefined;
    const assignedToId = user.role === "trainer" ? user.id : undefined;

    const result = await this.requestService.listRequests(
      user.tenantId,
      userId,
      status,
      assignedToId,
      page || 1,
      limit || 20,
    );

    return {
      data: result.requests,
      total: result.total,
      page: page || 1,
      limit: limit || 20,
    };
  }

  /**
   * 3. Assign trainer to request
   * PATCH /api/v1/onboarding/training/requests/:id/assign
   */
  @Patch(":id/assign")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async assignTrainer(
    @Param("id") requestId: string,
    @Body("assigned_to_id") trainerId: string,
    @GetUser() user: any,
  ) {
    return await this.requestService.assignTrainer(
      requestId,
      user.tenantId,
      trainerId,
    );
  }

  /**
   * 4. Schedule training session
   * PATCH /api/v1/onboarding/training/requests/:id/schedule
   */
  @Patch(":id/schedule")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async scheduleSession(
    @Param("id") requestId: string,
    @Body()
    body: {
      scheduled_at: string;
      duration_minutes?: number;
      meeting_url?: string;
      meeting_location?: string;
    },
    @GetUser() user: any,
  ) {
    return await this.requestService.scheduleSession(
      requestId,
      user.tenantId,
      new Date(body.scheduled_at),
      body.duration_minutes,
      body.meeting_url,
      body.meeting_location,
    );
  }

  /**
   * 5. Mark request as completed
   * PATCH /api/v1/onboarding/training/requests/:id/complete
   */
  @Patch(":id/complete")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async completeSession(
    @Param("id") requestId: string,
    @Body()
    body: {
      completion_notes?: string;
      satisfaction_rating?: number;
    },
    @GetUser() user: any,
  ) {
    return await this.requestService.completeSession(
      requestId,
      user.tenantId,
      body.completion_notes,
      body.satisfaction_rating,
    );
  }
}
