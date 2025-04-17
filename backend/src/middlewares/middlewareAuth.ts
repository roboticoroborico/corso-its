import { Context, Next } from "koa";
import { COOKIE_SESSION_NAME } from "../consts";
import prisma from "../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authJWT } from "./middlewareJWT";

// Middleware to check if the user is authenticated
export const authUser = async (ctx: Context, next: Next) => {
  const sessionId = ctx.cookies.get(COOKIE_SESSION_NAME);

  console.log(sessionId);

  if (!sessionId) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session || !session.user) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  ctx.state.user = session.user;
  await next();
};

export const userRole = async (
  ctx: Context,
  next: Next,
  role: USER_ROLE = USER_ROLE.GUEST
) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  if (user.role === USER_ROLE.ADMIN) {
    await next();
  } else {
    if (user.role !== role) {
      ctx.status = 403;
      ctx.body = { error: "Forbidden" };
      return;
    }

    await next();
  }
};
