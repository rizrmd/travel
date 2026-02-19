import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LeadsService } from "./services/leads.service";
import { LandingPagesService } from "../landing-pages/services/landing-pages.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import {
  UpdateLeadStatusDto,
  AssignLeadDto,
} from "./dto/update-lead-status.dto";
import { LeadQueryDto } from "./dto/lead-query.dto";
import { LeadResponseDto, LeadListResponseDto } from "./dto/lead-response.dto";

/**
 * Epic 10, Story 10.5: Leads Controller
 */
@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly landingPagesService: LandingPagesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Submit lead form (Public - No Auth)",
    description: "Creates a new lead from landing page or website form",
  })
  @ApiResponse({ status: 201, type: LeadResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateLeadDto,
    @Ip() ipAddress: string,
    @Headers("user-agent") userAgent: string,
  ): Promise<LeadResponseDto> {
    // Auto-capture IP and user agent if not provided
    if (!dto.ipAddress) {
      dto.ipAddress = ipAddress;
    }
    if (!dto.userAgent) {
      dto.userAgent = userAgent;
    }

    // Determine agent and tenant from landing page
    let agentId: string;
    let tenantId: string;

    if (dto.landingPageId) {
      // TODO: Get agent and tenant from landing page
      // For MVP, this needs to be implemented
      // const landingPage = await this.landingPagesService.findBySlug(...);
      agentId = "agent-id-placeholder";
      tenantId = "tenant-id-placeholder";

      // Increment landing page lead count
      await this.landingPagesService.incrementLeads(dto.landingPageId);
    } else {
      // Default values for direct website submissions
      agentId = "default-agent";
      tenantId = "default-tenant";
    }

    const lead = await this.leadsService.create(dto, agentId, tenantId);

    // TODO: Send email notification to agent
    // TODO: Send auto-reply email to prospect
    // TODO: Emit WebSocket event

    return lead;
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "List leads (Agent/Admin)" })
  @ApiResponse({ status: 200, type: LeadListResponseDto })
  async findAll(
    @Query() query: LeadQueryDto,
    @Request() req: any,
  ): Promise<LeadListResponseDto> {
    // If agent role, filter by their leads only
    if (req.user.role === "agent") {
      query.agentId = req.user.id;
    }

    const { data, total } = await this.leadsService.findAll(
      query,
      req.user.tenantId,
    );

    const totalPages = Math.ceil(total / query.limit);

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
    };
  }

  @Get("hot")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get hot leads (< 24 hours old)" })
  @ApiResponse({ status: 200, type: [LeadResponseDto] })
  async getHotLeads(@Request() req: any): Promise<LeadResponseDto[]> {
    return await this.leadsService.getHotLeads(req.user.tenantId);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get lead details (Agent/Admin)" })
  @ApiResponse({ status: 200, type: LeadResponseDto })
  async findOne(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    return await this.leadsService.findOne(id, req.user.tenantId);
  }

  @Patch(":id/status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update lead status (Agent/Admin)" })
  @ApiResponse({ status: 200, type: LeadResponseDto })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateLeadStatusDto,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    return await this.leadsService.updateStatus(id, dto, req.user.tenantId);
  }

  @Post(":id/contact")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark lead as contacted (Agent/Admin)" })
  @ApiResponse({ status: 200, type: LeadResponseDto })
  async markAsContacted(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    return await this.leadsService.markAsContacted(id, req.user.tenantId);
  }

  @Post(":id/assign")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Assign lead to agent (Admin only)" })
  @ApiResponse({ status: 200, type: LeadResponseDto })
  async assignToAgent(
    @Param("id") id: string,
    @Body() dto: AssignLeadDto,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    // TODO: Add admin role check
    return await this.leadsService.assignToAgent(
      id,
      dto.agentId,
      req.user.tenantId,
    );
  }
}
