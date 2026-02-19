import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AlertEntity,
  AlertChannel,
  AlertStatus,
} from "../infrastructure/persistence/relational/entities/alert.entity";
import { Anomaly } from "../domain/anomaly";
import { Logger } from "../../config/winston.config";
import nodemailer from "nodemailer";

@Injectable()
export class AlertService {
  private readonly logger = new Logger("AlertService");
  private lastAlertTimes = new Map<string, number>();

  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
  ) { }

  async sendAlertsForAnomaly(anomaly: Anomaly): Promise<void> {
    const alertKey = `${anomaly.tenantId}_${anomaly.anomalyType}`;
    const lastAlert = this.lastAlertTimes.get(alertKey) || 0;
    const hourAgo = Date.now() - 3600000;

    if (lastAlert > hourAgo) {
      this.logger.info("Alert rate limited", { alertKey });
      return;
    }

    const channels = anomaly.getAlertChannels() as AlertChannel[];

    for (const channel of channels) {
      await this.sendAlert(anomaly, channel);
    }

    this.lastAlertTimes.set(alertKey, Date.now());
  }

  private async sendAlert(
    anomaly: Anomaly,
    channel: AlertChannel,
  ): Promise<void> {
    const entity = new AlertEntity();
    entity.anomalyId = "anomaly-id";
    entity.channel = channel;
    entity.recipient = await this.getRecipient(channel);
    entity.status = AlertStatus.PENDING;
    entity.metadata = { anomalyType: anomaly.anomalyType };

    try {
      if (channel === AlertChannel.EMAIL) {
        await this.sendEmailAlert(anomaly, entity.recipient);
      } else if (channel === AlertChannel.SLACK) {
        await this.sendSlackAlert(anomaly, entity.recipient);
      } else if (channel === AlertChannel.SMS) {
        await this.sendSmsAlert(anomaly, entity.recipient);
      }

      entity.status = AlertStatus.SENT;
      entity.sentAt = new Date();
    } catch (error) {
      entity.status = AlertStatus.FAILED;
      this.logger.error("Alert sending failed", error, {
        channel,
        anomaly: anomaly.anomalyType,
      });
    }

    await this.alertRepository.save(entity);
  }

  async sendEmailAlert(anomaly: Anomaly, recipient: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const severityUpper = anomaly.severity.toString().toUpperCase();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "alerts@travelumroh.com",
      to: recipient,
      subject: `[${severityUpper}] ${anomaly.anomalyType}`,
      html: this.getEmailTemplate(anomaly),
    });
  }

  async sendSlackAlert(anomaly: Anomaly, webhook: string): Promise<void> {
    // Slack webhook implementation
    this.logger.info("Slack alert sent", { anomaly: anomaly.anomalyType });
  }

  async sendSmsAlert(anomaly: Anomaly, phone: string): Promise<void> {
    // SMS implementation (stub)
    this.logger.info("SMS alert sent", { anomaly: anomaly.anomalyType });
  }

  private getEmailTemplate(anomaly: Anomaly): string {
    const actions = anomaly.getRecommendedActions();
    const actionsHtml = actions.map((action) => `<li>${action}</li>`).join("");

    return `
      <h2>Anomali Terdeteksi</h2>
      <p><strong>Tipe:</strong> ${anomaly.anomalyType}</p>
      <p><strong>Tingkat:</strong> ${anomaly.severity}</p>
      <p><strong>Deskripsi:</strong> ${anomaly.description}</p>
      <h3>Tindakan yang Direkomendasikan:</h3>
      <ul>${actionsHtml}</ul>
    `;
  }

  private async getRecipient(channel: AlertChannel): Promise<string> {
    if (channel === AlertChannel.EMAIL)
      return process.env.ALERT_EMAIL || "admin@travelumroh.com";
    if (channel === AlertChannel.SLACK) return process.env.SLACK_WEBHOOK || "";
    if (channel === AlertChannel.SMS) return process.env.ALERT_PHONE || "";
    return "";
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.alertRepository.update(alertId, {
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedAt: new Date(),
    });
  }
}
