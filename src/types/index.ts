import { Response, Request } from "express";

// Language
export type Language = "tr" | "en";

// Base Response
export interface BaseResponse {
  timestamp: string;
  statusCode: number;
}

// Success Response
export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  message: string;
}

// Error Response
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: string;
  message: string;
  friendlyMessage?: string;
  description?: string;
  isBusinessError: boolean;
}

// Response Helper Params
export interface SuccessParams<T = any> {
  response: Response;
  request?: Request;
  data: T;
  messageKey?: string;
  message?: string;
  statusCode?: number;
}

export interface ErrorParams {
  response: Response;
  request?: Request;
  messageKey?: string;
  message?: string;
  errorKey?: string;
  error?: string;
  statusCode?: number;
}

// Message Helper Return Types
export interface SuccessMessageResult {
  message: string;
  statusCode: number;
}

export interface ErrorMessageResult {
  message: string;
  statusCode: number;
  friendlyMessage?: string;
  description?: string;
  isBusinessError: boolean;
}
