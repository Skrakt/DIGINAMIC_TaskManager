import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CurrentUserData } from "../../auth/interfaces/current-user.interface";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserData => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: CurrentUserData }>();
    return request.user;
  },
);
