import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * GetUser Decorator
 * Extracts the user object from the request
 */
export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (data) {
            return request.user?.[data];
        }
        return request.user;
    },
);
