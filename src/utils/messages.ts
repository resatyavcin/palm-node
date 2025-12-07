import { prisma } from "../lib/prisma";
import { Request } from "express";
import { Language } from "../types";

// Fallback mesajlar (veritabanı bağlantısı başarısız olursa)
const fallbackMessages: {
  success: {
    [key: string]: { tr: string; en: string; statusCode: number };
  };
  error: {
    [key: string]: {
      tr: string;
      en: string;
      statusCode: number;
      friendlyMessage?: string;
      description?: string;
      isBusinessError: boolean;
    };
  };
} = {
  success: {
    default: {
      tr: "İşlem başarıyla tamamlandı",
      en: "Operation completed successfully",
      statusCode: 200,
    },
  },
  error: {
    default: {
      tr: "Bir hata oluştu",
      en: "An error occurred",
      statusCode: 500,
      friendlyMessage: undefined,
      description: "Bu mesaj otomatik oluşturuldu",
      isBusinessError: false,
    },
  },
};

export class MessageHelper {
  private static getLanguage(req?: Request): Language {
    if (req?.headers?.["accept-language"]) {
      const lang = req.headers["accept-language"].split(",")[0].split("-")[0];
      if (lang === "tr" || lang === "en") {
        return lang;
      }
    }
    return "en";
  }

  static async getMessage(
    key: string,
    req?: Request
  ): Promise<{ message: string }> {
    const language = this.getLanguage(req);

    try {
      const message = await prisma.successMessage.findUnique({
        where: { key },
      });

      if (message) {
        return {
          message: language === "tr" ? message.tr : message.en,
        };
      }
    } catch (error) {
      // Veritabanı hatası durumunda fallback kullan
    }

    // Fallback
    const fallback =
      fallbackMessages.success[key] || fallbackMessages.success.default;
    return {
      message: fallback[language],
    };
  }

  /**
   * Success mesajı getirir
   */
  static async getSuccessMessage(
    key: string,
    req?: Request
  ): Promise<{ message: string; statusCode: number }> {
    const language = this.getLanguage(req);

    try {
      const message = await prisma.successMessage.findUnique({
        where: { key },
      });

      if (message) {
        return {
          message: language === "tr" ? message.tr : message.en,
          statusCode: message.statusCode,
        };
      }
    } catch (error) {
      // Veritabanı hatası durumunda fallback kullan
    }

    // Fallback
    const fallback =
      fallbackMessages.success[key] || fallbackMessages.success.default;
    return {
      message: fallback[language],
      statusCode: fallback.statusCode,
    };
  }

  /**
   * Error mesajı getirir
   */
  static async getErrorMessage(
    key: string,
    req?: Request
  ): Promise<{
    message: string;
    statusCode: number;
    friendlyMessage?: string;
    description?: string;
    isBusinessError: boolean;
  }> {
    const language = this.getLanguage(req);

    try {
      const message = await prisma.errorMessage.findUnique({
        where: { key },
      });

      if (message) {
        return {
          message: language === "tr" ? message.tr : message.en,
          statusCode: message.statusCode,
          friendlyMessage: message.friendlyMessage || undefined,
          description: message.description || undefined,
          isBusinessError: message.isBusinessError,
        };
      }
    } catch (error) {
      // Veritabanı hatası durumunda fallback kullan
    }

    // Fallback
    const fallback =
      fallbackMessages.error[key] || fallbackMessages.error.default;
    return {
      message: fallback[language],
      statusCode: fallback.statusCode,
      friendlyMessage: fallback.friendlyMessage,
      description: fallback.description,
      isBusinessError: fallback.isBusinessError,
    };
  }
}
