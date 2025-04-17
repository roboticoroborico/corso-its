import Router from "@koa/router";
import { Prisma, User } from "@prisma/client";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { COOKIE_SESSION_NAME } from "../consts";
import { authUser } from "../middlewares/middlewareAuth";
import { userSchema } from "../../prisma/validation/validationUser";
import { authJWT } from "../middlewares/middlewareJWT";

const router = new Router({
  prefix: "/user",
});

// POST: /user/register: create a new user
router.post("/register", authJWT, async (ctx) => {
  ctx.request.body = userSchema.parse(ctx.request.body);
  const { email, password } = ctx.request.body as User;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    ctx.status = 201;
    ctx.body = { message: "User created", user };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        ctx.status = 409;
        ctx.body = { error: "User mail duplicated" };
      }
    } else {
      ctx.status = 500;
      ctx.body = { error: "Error creating user" };
    }
  }
});

// POST: /user/login: login a user
router.post("/login", async (ctx) => {
  const { email, password } = ctx.request.body as User;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Invalid credentials" };
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      ctx.status = 401;
      ctx.body = { error: "Invalid credentials" };
      return;
    }

    // Session ID generation
    const sessionId = crypto.randomBytes(32).toString("hex");
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionId,
      },
    });

    ctx.cookies.set(COOKIE_SESSION_NAME, sessionId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    ctx.status = 200;
    ctx.body = { message: "Login successful", user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error logging in" };
  }
});

// POST: /user/logout: logout a user
router.post("/logout", authJWT, authUser, async (ctx) => {
  const sessionId = ctx.cookies.get(COOKIE_SESSION_NAME);

  if (!sessionId) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  try {
    await prisma.session.delete({
      where: {
        sessionId,
      },
    });

    ctx.cookies.set(COOKIE_SESSION_NAME, "", {
      httpOnly: true,
      maxAge: 0,
    });

    ctx.status = 200;
    ctx.body = { message: "Logout successful" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error logging out" };
  }
});

// PATCH: /user/:id: update user
router.patch("/:id", authJWT, authUser, async (ctx) => {
  const id = ctx.params.id;
  const { email, password } = ctx.request.body as User;
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    ctx.status = 200;
    ctx.body = { message: "User updated" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error updating user" };
  }
});

// DELETE: /user/:id: delete user
router.delete("/:id", authJWT, authUser, async (ctx) => {
  const id = ctx.params.id;

  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  ctx.status = 200;
  ctx.body = { message: "User deleted" };
});

export default router;
