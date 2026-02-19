import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { LandingPagesService } from "./services/landing-pages.service";
import {
  TemplateRendererService,
  TemplateData,
} from "./services/template-renderer.service";
import { PageAnalyticsService } from "../analytics/services/page-analytics.service";
import { CreateLandingPageDto } from "./dto/create-landing-page.dto";
import { UpdateLandingPageDto } from "./dto/update-landing-page.dto";
import { LandingPageQueryDto } from "./dto/landing-page-query.dto";
import {
  LandingPageResponseDto,
  LandingPageListResponseDto,
} from "./dto/landing-page-response.dto";

/**
 * Epic 10, Story 10.2: Landing Pages Controller
 */
@ApiTags("Landing Pages")
@Controller("landing-pages")
export class LandingPagesController {
  constructor(
    private readonly landingPagesService: LandingPagesService,
    private readonly templateRenderer: TemplateRendererService,
    private readonly analyticsService: PageAnalyticsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create landing page (Agent)" })
  @ApiResponse({ status: 201, type: LandingPageResponseDto })
  async create(
    @Body() dto: CreateLandingPageDto,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.create(
      dto,
      req.user.id,
      req.user.tenantId,
    );
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "List landing pages (Agent)" })
  @ApiResponse({ status: 200, type: LandingPageListResponseDto })
  async findAll(
    @Query() query: LandingPageQueryDto,
    @Request() req: any,
  ): Promise<LandingPageListResponseDto> {
    const { data, total } = await this.landingPagesService.findAll(
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

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get landing page details (Agent)" })
  @ApiResponse({ status: 200, type: LandingPageResponseDto })
  async findOne(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.findOne(id, req.user.tenantId);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update landing page (Agent)" })
  @ApiResponse({ status: 200, type: LandingPageResponseDto })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateLandingPageDto,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.update(id, dto, req.user.tenantId);
  }

  @Post(":id/publish")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Publish landing page (Agent)" })
  @ApiResponse({ status: 200, type: LandingPageResponseDto })
  async publish(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.publish(id, req.user.tenantId);
  }

  @Post(":id/archive")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Archive landing page (Agent)" })
  @ApiResponse({ status: 200, type: LandingPageResponseDto })
  async archive(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.archive(id, req.user.tenantId);
  }

  @Post(":id/duplicate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Duplicate landing page (Agent)" })
  @ApiResponse({ status: 201, type: LandingPageResponseDto })
  async duplicate(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<LandingPageResponseDto> {
    return await this.landingPagesService.duplicate(id, req.user.tenantId);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete landing page (Agent)" })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string, @Request() req: any): Promise<void> {
    await this.landingPagesService.delete(id, req.user.tenantId);
  }

  @Get(":id/analytics")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get landing page analytics (Agent)" })
  @ApiResponse({ status: 200 })
  async getAnalytics(@Param("id") id: string, @Request() req: any) {
    return await this.analyticsService.getPageAnalytics(id, req.user.tenantId);
  }
}

/**
 * Public Landing Page Controller (No Auth Required)
 */
@ApiTags("Public Landing Pages")
@Controller("p")
export class PublicLandingPagesController {
  constructor(
    private readonly landingPagesService: LandingPagesService,
    private readonly templateRenderer: TemplateRendererService,
    private readonly analyticsService: PageAnalyticsService,
  ) {}

  @Get(":slug")
  @ApiOperation({ summary: "View public landing page (No auth)" })
  @ApiResponse({ status: 200, description: "Returns HTML page" })
  async viewPage(
    @Param("slug") slug: string,
    @Query("utm_source") utmSource: string,
    @Query("utm_medium") utmMedium: string,
    @Query("utm_campaign") utmCampaign: string,
    @Request() req: any,
    @Res() res: Response,
  ): Promise<void> {
    // Find landing page
    const landingPage = await this.landingPagesService.findBySlug(slug);

    // Track page view
    await this.analyticsService.trackPageView(landingPage.id, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      utmSource,
      utmMedium,
      utmCampaign,
    });

    // TODO: Fetch package and agent data
    // For MVP, using mock data
    const templateData: TemplateData = {
      package: {
        name: "Umroh Ekonomis 9 Hari",
        description: "Paket Umroh hemat dengan fasilitas terbaik",
        price: 25000000,
        duration: 9,
        departure_date: "2025-03-15",
        hotel_makkah: "Hotel Bintang 3 (800m dari Masjidil Haram)",
        hotel_madinah: "Hotel Bintang 3 (400m dari Masjid Nabawi)",
        airline: "Saudia Airlines",
        inclusions: [
          "Tiket pesawat PP",
          "Hotel full AC",
          "Makan 3x sehari",
          "Transport bus AC",
          "Perlengkapan umroh",
          "Bimbingan ibadah",
          "Visa & asuransi",
        ],
        itinerary: [
          {
            day: 1,
            title: "Keberangkatan Jakarta - Jeddah",
            description: "Berkumpul di bandara, penerbangan menuju Jeddah",
          },
          {
            day: 2,
            title: "Tiba di Jeddah - Menuju Madinah",
            description:
              "Tiba di Jeddah, perjalanan menuju Madinah, check-in hotel",
          },
          // Add more days...
        ],
      },
      agent: {
        name: landingPage.customizations.agentName || "Agent Name",
        photo: landingPage.customizations.profilePhoto,
        tagline: landingPage.customizations.tagline,
        phone: landingPage.customizations.phone || "",
        email: landingPage.customizations.email || "",
        whatsapp: landingPage.customizations.whatsappNumber || "",
        logo: landingPage.customizations.logo,
        intro_text: landingPage.customizations.introText,
        intro_video_url: landingPage.customizations.introVideoUrl,
        social_media: {
          facebook: landingPage.customizations.facebookUrl,
          instagram: landingPage.customizations.instagramUrl,
          tiktok: landingPage.customizations.tiktokUrl,
          linkedin: landingPage.customizations.linkedinUrl,
        },
      },
      colors: {
        primary: landingPage.customizations.primaryColor || "#3B82F6",
        secondary: landingPage.customizations.secondaryColor || "#10B981",
        accent: landingPage.customizations.accentColor || "#F59E0B",
      },
      meta: {
        title:
          landingPage.customizations.metaTitle ||
          `${landingPage.customizations.agentName || "Agen"} - Paket Umroh Terbaik`,
        description:
          landingPage.customizations.metaDescription ||
          "Bergabunglah dengan kami untuk perjalanan Umroh yang berkesan",
        og_image: landingPage.customizations.ogImageUrl,
        url: `${req.protocol}://${req.get("host")}/p/${slug}`,
      },
      utm: {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
      },
    };

    // Render template
    const html = await this.templateRenderer.render(
      landingPage.templateId,
      templateData,
    );

    // Send HTML response
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }
}
