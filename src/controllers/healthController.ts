import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ResponseHelper } from "../utils/response";

export const checkHealth = async (req: Request, res: Response) => {
  try {
    const systemHealth = await prisma.systemHealth.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!systemHealth) {
      await prisma.systemHealth.create({
        data: {
          isHealth: true,
        },
      });
    }

    return ResponseHelper.success({
      response: res,
      data: {
        status: "UP",
        database: "Connected",
        isHealth: systemHealth?.isHealth ?? true,
      },
      message: "System is healthy",
    });
  } catch (error) {
    return ResponseHelper.internalServerError({
      response: res,
      error: error instanceof Error ? error : new Error("Unknown error"),
      message: "Database connection failed",
    });
  }
};
