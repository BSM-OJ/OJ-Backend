import { createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log(req.user);
    return req.user;
})