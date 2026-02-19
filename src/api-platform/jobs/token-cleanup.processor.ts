import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { AccessTokenEntity } from "../infrastructure/persistence/relational/entities/access-token.entity";

@Injectable()
export class TokenCleanupProcessor {
  private readonly logger = new Logger(TokenCleanupProcessor.name);

  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly accessTokenRepository: Repository<AccessTokenEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredTokens(): Promise<void> {
    this.logger.log("Starting expired token cleanup");

    try {
      // Delete tokens that expired more than 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.accessTokenRepository.delete({
        expiresAt: LessThan(sevenDaysAgo),
      });

      this.logger.log(`Cleaned up ${result.affected} expired tokens`);
    } catch (error) {
      this.logger.error("Error cleaning up expired tokens", error);
    }
  }
}
