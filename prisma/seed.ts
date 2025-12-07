import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Success Messages
  const successMessages = [
    {
      key: "default",
      tr: "İşlem başarıyla tamamlandı",
      en: "Operation completed successfully",
      statusCode: 200,
    },
    {
      key: "healthCheck",
      tr: "Sistem sağlıklı",
      en: "System is healthy",
      statusCode: 200,
    },
    {
      key: "created",
      tr: "Kayıt başarıyla oluşturuldu",
      en: "Record created successfully",
      statusCode: 201,
    },
    {
      key: "updated",
      tr: "Kayıt başarıyla güncellendi",
      en: "Record updated successfully",
      statusCode: 200,
    },
    {
      key: "deleted",
      tr: "Kayıt başarıyla silindi",
      en: "Record deleted successfully",
      statusCode: 200,
    },
  ];

  // Error Messages
  const errorMessages = [
    {
      key: "default",
      tr: "Bir hata oluştu",
      en: "An error occurred",
      statusCode: 500,
      friendlyMessage: null,
      description: null,
      isBusinessError: false,
    },
    {
      key: "badRequest",
      tr: "Geçersiz istek",
      en: "Bad Request",
      statusCode: 400,
      friendlyMessage: null,
      description: null,
      isBusinessError: true,
    },
    {
      key: "unauthorized",
      tr: "Yetkisiz erişim",
      en: "Unauthorized",
      statusCode: 401,
      friendlyMessage: null,
      description: null,
      isBusinessError: false,
    },
    {
      key: "forbidden",
      tr: "Erişim engellendi",
      en: "Forbidden",
      statusCode: 403,
      friendlyMessage: null,
      description: null,
      isBusinessError: false,
    },
    {
      key: "notFound",
      tr: "Kayıt bulunamadı",
      en: "Not Found",
      statusCode: 404,
      friendlyMessage: null,
      description: null,
      isBusinessError: true,
    },
    {
      key: "internalServerError",
      tr: "Sunucu hatası",
      en: "Internal Server Error",
      statusCode: 500,
      friendlyMessage: null,
      description: null,
      isBusinessError: false,
    },
    {
      key: "databaseConnectionFailed",
      tr: "Veritabanı bağlantısı başarısız",
      en: "Database connection failed",
      statusCode: 500,
      friendlyMessage: null,
      description: null,
      isBusinessError: false,
    },
    {
      key: "validationError",
      tr: "Doğrulama hatası",
      en: "Validation Error",
      statusCode: 400,
      friendlyMessage: null,
      description: null,
      isBusinessError: true,
    },
  ];

  // Upsert success messages
  for (const message of successMessages) {
    await prisma.successMessage.upsert({
      where: { key: message.key },
      update: message,
      create: message,
    });
  }

  // Upsert error messages
  for (const message of errorMessages) {
    await prisma.errorMessage.upsert({
      where: { key: message.key },
      update: message,
      create: message,
    });
  }

  console.log("✅ Messages seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding messages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
