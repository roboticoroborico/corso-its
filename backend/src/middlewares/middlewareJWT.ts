import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { IPayloadJwt } from "../types";
import prisma from "../../prisma/client";

export const authJWT = async (ctx: Context, next: Next) => {
  const authToken = ctx.request.headers["authorization"] as string;
  if (!authToken) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  const token = authToken.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  const payload = jwt.verify(
    token,
    process.env.API_SECRET_TOKEN || ""
  ) as IPayloadJwt;

  if (!payload) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  const client = await prisma.apiClient.findUnique({
    where: {
      id: payload.clientId,
    },
  });

  if (!client || client.version !== payload.version) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  await next();
};
