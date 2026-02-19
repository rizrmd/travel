/**
 * Epic 4, Story 4.5: Package Broadcast Service
 * Real-time package updates to agents via WebSocket
 */

import { Injectable, Logger } from "@nestjs/common";
import { WebSocketEventEmitter } from "../../websocket/events/websocket-event.emitter";
import { WebSocketEventType } from "../../websocket/types/websocket-events.type";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { PackageVersion } from "../domain/package-version";

@Injectable()
export class PackageBroadcastService {
  private readonly logger = new Logger(PackageBroadcastService.name);

  constructor(private readonly websocketEmitter: WebSocketEventEmitter) {}

  /**
   * Broadcast package created event
   * Story 4.5: Notify agents of new package
   */
  async broadcastPackageCreated(packageEntity: PackageEntity): Promise<void> {
    try {
      await this.websocketEmitter.emitPackageEvent(
        WebSocketEventType.PACKAGE_CREATED,
        packageEntity.tenant_id,
        {
          packageId: packageEntity.id,
          packageName: packageEntity.name,
          departureDate: packageEntity.departure_date.toISOString(),
          retailPrice: packageEntity.retail_price,
          wholesalePrice: packageEntity.wholesale_price,
          availableSlots: packageEntity.available_slots,
          status: packageEntity.status,
        },
        packageEntity.created_by_id,
      );

      this.logger.log(
        `Package created event broadcast for package ${packageEntity.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast package created event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Broadcast package updated event
   * Story 4.5: Notify agents of package changes
   */
  async broadcastPackageUpdated(
    newPackageEntity: PackageEntity,
    oldPackageEntity: Partial<PackageEntity>,
  ): Promise<void> {
    try {
      // Generate change summary
      const oldSnapshot = this.createSnapshot(oldPackageEntity);
      const newSnapshot = this.createSnapshot(newPackageEntity);
      const { summary } = PackageVersion.createChangeSummary(
        oldSnapshot,
        newSnapshot,
      );

      await this.websocketEmitter.emitPackageEvent(
        WebSocketEventType.PACKAGE_UPDATED,
        newPackageEntity.tenant_id,
        {
          packageId: newPackageEntity.id,
          packageName: newPackageEntity.name,
          changeSummary: summary,
          departureDate: newPackageEntity.departure_date.toISOString(),
          retailPrice: newPackageEntity.retail_price,
          wholesalePrice: newPackageEntity.wholesale_price,
          availableSlots: newPackageEntity.available_slots,
          status: newPackageEntity.status,
        },
      );

      this.logger.log(
        `Package updated event broadcast for package ${newPackageEntity.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast package updated event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Broadcast package deleted event
   * Story 4.5: Notify agents of package deletion
   */
  async broadcastPackageDeleted(packageEntity: PackageEntity): Promise<void> {
    try {
      await this.websocketEmitter.emitPackageEvent(
        WebSocketEventType.PACKAGE_DELETED,
        packageEntity.tenant_id,
        {
          packageId: packageEntity.id,
          packageName: packageEntity.name,
          departureDate: packageEntity.departure_date.toISOString(),
          retailPrice: packageEntity.retail_price,
          wholesalePrice: packageEntity.wholesale_price,
          availableSlots: packageEntity.available_slots,
          status: packageEntity.status,
        },
      );

      this.logger.log(
        `Package deleted event broadcast for package ${packageEntity.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast package deleted event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Broadcast package slots updated event
   * When slots change due to jamaah assignment/removal
   */
  async broadcastSlotsUpdated(packageEntity: PackageEntity): Promise<void> {
    try {
      await this.websocketEmitter.emitPackageEvent(
        WebSocketEventType.PACKAGE_UPDATED,
        packageEntity.tenant_id,
        {
          packageId: packageEntity.id,
          packageName: packageEntity.name,
          changeSummary: `Slot tersedia diperbarui menjadi ${packageEntity.available_slots}`,
          departureDate: packageEntity.departure_date.toISOString(),
          retailPrice: packageEntity.retail_price,
          wholesalePrice: packageEntity.wholesale_price,
          availableSlots: packageEntity.available_slots,
          status: packageEntity.status,
        },
      );

      this.logger.log(
        `Package slots updated event broadcast for package ${packageEntity.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast slots updated event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Create snapshot for change comparison
   */
  private createSnapshot(
    packageEntity: Partial<PackageEntity>,
  ): Record<string, any> {
    return {
      name: packageEntity.name,
      description: packageEntity.description,
      duration_days: packageEntity.duration_days,
      retail_price: packageEntity.retail_price,
      wholesale_price: packageEntity.wholesale_price,
      cost_price: packageEntity.cost_price,
      capacity: packageEntity.capacity,
      available_slots: packageEntity.available_slots,
      departure_date: packageEntity.departure_date?.toISOString(),
      return_date: packageEntity.return_date?.toISOString(),
      status: packageEntity.status,
    };
  }
}
