import { Response } from "express";
import { MessageHelper } from "./messages";
import {
  type SuccessResponse,
  type ErrorResponse,
  type SuccessParams,
  type ErrorParams,
} from "../types";

export class ResponseHelper {
  static async success<T>(params: SuccessParams<T>): Promise<Response> {
    const { response, request, data, messageKey, message, statusCode } = params;

    let finalMessage: string;
    let finalStatusCode: number;

    if (message) {
      // Direkt mesaj verilmişse onu kullan
      finalMessage = message;
      finalStatusCode = statusCode || 200;
    } else if (messageKey) {
      // messageKey verilmişse DB'den çek
      const messageData = await MessageHelper.getSuccessMessage(
        messageKey,
        request
      );
      finalMessage = messageData.message;
      finalStatusCode = statusCode || messageData.statusCode;
    } else {
      // İkisi de yoksa default
      const messageData = await MessageHelper.getSuccessMessage(
        "default",
        request
      );
      finalMessage = messageData.message;
      finalStatusCode = statusCode || messageData.statusCode;
    }

    const apiResponse: SuccessResponse<T> = {
      success: true,
      data,
      message: finalMessage,
      timestamp: new Date().toISOString(),
      statusCode: finalStatusCode,
    };

    return response.status(finalStatusCode).json(apiResponse);
  }

  static async error(params: ErrorParams): Promise<Response> {
    const {
      response,
      request,
      messageKey,
      message,
      errorKey,
      error,
      statusCode,
    } = params;

    let finalMessage: string;
    let finalError: string;
    let friendlyMessage: string | undefined;
    let description: string | undefined;
    let isBusinessError: boolean = false;
    let finalStatusCode: number;

    if (message) {
      // Direkt mesaj verilmişse
      finalMessage = message;
      finalError = error || message;
      finalStatusCode = statusCode || 500;
    } else if (messageKey) {
      // messageKey verilmişse DB'den çek
      const errorInfo = await MessageHelper.getErrorMessage(
        messageKey,
        request
      );
      finalMessage = errorInfo.message;
      finalStatusCode = statusCode || errorInfo.statusCode;
      friendlyMessage = errorInfo.friendlyMessage;
      description = errorInfo.description;
      isBusinessError = errorInfo.isBusinessError;

      // Error mesajını belirle: errorKey varsa ondan, yoksa error parametresinden, yoksa message'dan
      if (errorKey) {
        const errorKeyInfo = await MessageHelper.getErrorMessage(
          errorKey,
          request
        );
        finalError = errorKeyInfo.message;
      } else if (error) {
        finalError = error;
      } else {
        finalError = finalMessage;
      }
    } else {
      // İkisi de yoksa default
      const errorInfo = await MessageHelper.getErrorMessage("default", request);
      finalMessage = errorInfo.message;
      finalError = error || finalMessage;
      finalStatusCode = statusCode || errorInfo.statusCode;
      friendlyMessage = errorInfo.friendlyMessage;
      description = errorInfo.description;
      isBusinessError = errorInfo.isBusinessError;
    }

    const apiResponse: ErrorResponse = {
      success: false,
      error: finalError,
      message: finalMessage,
      friendlyMessage,
      description,
      isBusinessError,
      timestamp: new Date().toISOString(),
      statusCode: finalStatusCode,
    };

    return response.status(finalStatusCode).json(apiResponse);
  }
}
