import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";
import { DocumentEntity } from "../../documents/infrastructure/persistence/relational/entities/document.entity";
import { PublicApiService } from "../services/public-api.service";
import { PublicApiQueryDto } from "../dto/public-api-query.dto";
import { PublicApiResponseDto } from "../dto/public-api-response.dto";
import { OAuthGuard } from "../guards/oauth.guard";
import { ApiKeyGuard } from "../guards/api-key.guard";

@ApiTags("Public API v1")
@Controller("public/v1")
@UseGuards(OAuthGuard)
@ApiSecurity("bearer")
export class PublicApiController {
  constructor(
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly publicApiService: PublicApiService,
  ) { }

  // ============ JAMAAH ENDPOINTS ============

  @Get("jamaah")
  @ApiOperation({ summary: "List all jamaah" })
  @ApiResponse({ status: 200 })
  async listJamaah(
    @Query() query: PublicApiQueryDto,
    @Req() req: any,
  ): Promise<PublicApiResponseDto<any>> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    let queryBuilder = this.jamaahRepository
      .createQueryBuilder("entity")
      .where("entity.tenant_id = :tenantId", { tenantId });

    queryBuilder = this.publicApiService.buildQuery(queryBuilder, query, [
      "id",
      "full_name",
      "email",
      "phone",
      "status",
      "created_at",
    ]);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.publicApiService.formatResponse(
      data,
      total,
      query,
      "/public/v1/jamaah",
    );
  }

  @Get("jamaah/:id")
  @ApiOperation({ summary: "Get jamaah by ID" })
  @ApiResponse({ status: 200 })
  async getJamaah(@Param("id") id: string, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const jamaah = await this.jamaahRepository.findOne({
      where: { id, tenant_id: tenantId } as any,
    });

    if (!jamaah) {
      throw new Error("Jamaah not found");
    }

    return { data: jamaah };
  }

  @Post("jamaah")
  @ApiOperation({ summary: "Create new jamaah" })
  @ApiResponse({ status: 201 })
  async createJamaah(@Body() body: any, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const jamaah = this.jamaahRepository.create({
      ...body,
      tenant_id: tenantId,
    } as any);

    const saved = await this.jamaahRepository.save(jamaah);

    return { data: saved };
  }

  @Patch("jamaah/:id")
  @ApiOperation({ summary: "Update jamaah" })
  @ApiResponse({ status: 200 })
  async updateJamaah(
    @Param("id") id: string,
    @Body() body: any,
    @Req() req: any,
  ): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    await this.jamaahRepository.update({ id, tenant_id: tenantId } as any, body);

    const updated = await this.jamaahRepository.findOne({
      where: { id, tenant_id: tenantId } as any,
    });

    return { data: updated };
  }

  // ============ PAYMENT ENDPOINTS ============

  @Get("payments")
  @ApiOperation({ summary: "List all payments" })
  @ApiResponse({ status: 200 })
  async listPayments(
    @Query() query: PublicApiQueryDto,
    @Req() req: any,
  ): Promise<PublicApiResponseDto<any>> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    let queryBuilder = this.paymentRepository
      .createQueryBuilder("entity")
      .where("entity.tenant_id = :tenantId", { tenantId });

    queryBuilder = this.publicApiService.buildQuery(queryBuilder, query, [
      "id",
      "amount",
      "status",
      "paymentMethod",
      "createdAt",
    ]);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.publicApiService.formatResponse(
      data,
      total,
      query,
      "/public/v1/payments",
    );
  }

  @Get("payments/:id")
  @ApiOperation({ summary: "Get payment by ID" })
  @ApiResponse({ status: 200 })
  async getPayment(@Param("id") id: string, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const payment = await this.paymentRepository.findOne({
      where: { id, tenant_id: tenantId } as any,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return { data: payment };
  }

  @Post("payments")
  @ApiOperation({ summary: "Create new payment" })
  @ApiResponse({ status: 201 })
  async createPayment(@Body() body: any, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const payment = this.paymentRepository.create({
      ...body,
      tenant_id: tenantId,
    } as any);

    const saved = await this.paymentRepository.save(payment);

    return { data: saved };
  }

  // ============ PACKAGE ENDPOINTS ============

  @Get("packages")
  @ApiOperation({ summary: "List all packages" })
  @ApiResponse({ status: 200 })
  async listPackages(
    @Query() query: PublicApiQueryDto,
    @Req() req: any,
  ): Promise<PublicApiResponseDto<any>> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    let queryBuilder = this.packageRepository
      .createQueryBuilder("entity")
      .where("entity.tenant_id = :tenantId", { tenantId });

    queryBuilder = this.publicApiService.buildQuery(queryBuilder, query, [
      "id",
      "name",
      "retail_price",
      "duration_days",
      "departure_date",
      "created_at",
    ]);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.publicApiService.formatResponse(
      data,
      total,
      query,
      "/public/v1/packages",
    );
  }

  @Get("packages/:id")
  @ApiOperation({ summary: "Get package by ID" })
  @ApiResponse({ status: 200 })
  async getPackage(@Param("id") id: string, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const packageEntity = await this.packageRepository.findOne({
      where: { id, tenant_id: tenantId } as any,
    });

    if (!packageEntity) {
      throw new Error("Package not found");
    }

    return { data: packageEntity };
  }

  // ============ DOCUMENT ENDPOINTS ============

  @Get("documents")
  @ApiOperation({ summary: "List all documents" })
  @ApiResponse({ status: 200 })
  async listDocuments(
    @Query() query: PublicApiQueryDto,
    @Req() req: any,
  ): Promise<PublicApiResponseDto<any>> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    let queryBuilder = this.documentRepository
      .createQueryBuilder("entity")
      .where("entity.tenant_id = :tenantId", { tenantId });

    queryBuilder = this.publicApiService.buildQuery(queryBuilder, query, [
      "id",
      "type",
      "status",
      "uploadedAt",
      "createdAt",
    ]);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.publicApiService.formatResponse(
      data,
      total,
      query,
      "/public/v1/documents",
    );
  }

  @Get("documents/:id")
  @ApiOperation({ summary: "Get document by ID" })
  @ApiResponse({ status: 200 })
  async getDocument(@Param("id") id: string, @Req() req: any): Promise<any> {
    const tenantId = req.user?.tenantId || req.apiKey?.tenantId;

    const document = await this.documentRepository.findOne({
      where: { id, tenant_id: tenantId } as any,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    return { data: document };
  }

  // ============ EVENTS ENDPOINT ============

  @Get("events")
  @ApiOperation({ summary: "List available webhook events" })
  @ApiResponse({ status: 200 })
  async listEvents(): Promise<any> {
    return {
      data: [
        {
          event: "payment.confirmed",
          description: "Triggered when a payment is confirmed",
        },
        {
          event: "payment.failed",
          description: "Triggered when a payment fails",
        },
        {
          event: "jamaah.created",
          description: "Triggered when a new jamaah is created",
        },
        {
          event: "jamaah.updated",
          description: "Triggered when a jamaah is updated",
        },
        {
          event: "jamaah.deleted",
          description: "Triggered when a jamaah is deleted",
        },
        {
          event: "package.updated",
          description: "Triggered when a package is updated",
        },
        {
          event: "document.approved",
          description: "Triggered when a document is approved",
        },
        {
          event: "document.rejected",
          description: "Triggered when a document is rejected",
        },
        {
          event: "contract.signed",
          description: "Triggered when a contract is signed",
        },
      ],
    };
  }
}
