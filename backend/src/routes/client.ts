import Router from "@koa/router";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { ApiClient, USER_ROLE } from "@prisma/client";
import { API_CLIENT_DEFAULT_VERSION } from "../consts";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { IPayloadJwt } from "../types";
import { authJWT } from "../middlewares/middlewareJWT";

const router = new Router({
  prefix: "/client",
});

router.post(
  "/new",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const body = ctx.request.body as ApiClient;

    try {
      const client = await prisma.apiClient.create({
        data: {
          name: body.name,
          version: API_CLIENT_DEFAULT_VERSION,
        },
      });

      const secret = process.env.API_SECRET_TOKEN || "";

      try {
        const token = jwt.sign(
          {
            clientId: client.id,
            version: client.version,
          } as IPayloadJwt,
          secret
        );

        ctx.status = 201;
        ctx.body = {
          token,
        };
      } catch (error) {
        // nel caso di errore nella creazione del token, elimino il client
        await prisma.apiClient.delete({
          where: {
            id: client.id,
          },
        });
        ctx.status = 500;
        ctx.body = {
          error: "JWT Creation error",
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Internal server error",
      };
    }
  }
);

router.post(
  "/invalidate/:idClient",
  authJWT,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const idClient = ctx.params.idClient;
      const client = await prisma.apiClient.findUnique({
        where: {
          id: idClient,
        },
      });

      if (!client) {
        ctx.status = 404;
        ctx.body = {
          error: "Client not found",
        };
        return;
      }

      await prisma.apiClient.update({
        where: {
          id: idClient,
        },
        data: {
          version: client.version + 1,
        },
      });

      ctx.status = 200;
      ctx.body = {
        message: "Client invalidated",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Internal server error",
      };
    }
  }
);

export default router;
