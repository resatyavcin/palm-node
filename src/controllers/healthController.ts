import { Request, Response } from "express";
import { ResponseHelper } from "../utils/response";
import { checkHealth } from "../services/healthService";
import { MessageHelper } from "../utils/messages";

export const checkHealthController = async (
  request: Request,
  response: Response
) => {
  try {
    const systemHealth = await checkHealth();

    const data = {
      status: "UP",
      database: (await MessageHelper.getMessage("healthCheck")).message,
      isHealth: systemHealth?.isHealth ?? true,
    };

    return await ResponseHelper.success({
      response,
      request,
      data,
      messageKey: "healthCheck",
    });
  } catch (error) {
    return await ResponseHelper.error({
      response,
      request,
      messageKey: "databaseConnectionFailed",
    });
  }
};
