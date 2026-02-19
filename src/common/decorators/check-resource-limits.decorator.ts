import { SetMetadata } from "@nestjs/common";
import { ResourceType } from "../guards/resource-limits.guard";

/**
 * CheckResourceLimits Decorator
 * Marks a route as requiring resource limit check
 */
export const CheckResourceLimits = (resourceType: ResourceType) =>
  SetMetadata("resourceType", resourceType);
