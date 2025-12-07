import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    res.status(200).json({
      status: "UP",
      database: "Connected",
      isHealth: systemHealth?.isHealth ?? true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      database: "Disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
};
