/**
 * Epic 5, Story 5.6: Jamaah Delegation Controller
 * Delegation management endpoints
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DelegationService } from "../services/delegation.service";
import {
  CreateDelegationDto,
  DelegationResponseDto,
} from "../dto/delegation-token.dto";

@ApiTags("Jamaah Delegation")
@ApiBearerAuth()
@Controller("jamaah/:jamaahId/delegation")
export class JamaahDelegationController {
  constructor(private readonly delegationService: DelegationService) {}

  /**
   * Story 5.6: Create delegation
   */
  @Post()
  @ApiOperation({ summary: "Grant delegation permission to jamaah" })
  @ApiResponse({
    status: 201,
    description: "Delegation created successfully",
    type: DelegationResponseDto,
  })
  async createDelegation(
    @Param("jamaahId") jamaahId: string,
    @Body() dto: CreateDelegationDto,
    @Request() req,
  ): Promise<DelegationResponseDto> {
    // Note: In production, you'd need to get the jamaah's user_id
    // For now, we'll assume it's passed or fetched
    const jamaahUserId = req.body.jamaahUserId; // This should be fetched from jamaah entity

    return this.delegationService.createDelegation(
      jamaahId,
      jamaahUserId,
      dto,
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.6: Get jamaah delegations
   */
  @Get()
  @ApiOperation({ summary: "Get all active delegations for jamaah" })
  @ApiResponse({
    status: 200,
    description: "Returns active delegations",
    type: [DelegationResponseDto],
  })
  async getJamaahDelegations(
    @Param("jamaahId") jamaahId: string,
    @Request() req,
  ): Promise<DelegationResponseDto[]> {
    return this.delegationService.getJamaahDelegations(
      jamaahId,
      req.user.tenantId,
    );
  }

  /**
   * Story 5.6: Revoke delegation
   */
  @Delete(":delegationId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke delegation permission" })
  @ApiResponse({ status: 204, description: "Delegation revoked successfully" })
  @ApiResponse({ status: 404, description: "Delegation not found" })
  async revokeDelegation(
    @Param("jamaahId") jamaahId: string,
    @Param("delegationId") delegationId: string,
    @Request() req,
  ): Promise<void> {
    return this.delegationService.revokeDelegation(
      delegationId,
      req.user.tenantId,
      req.user.sub,
    );
  }
}
