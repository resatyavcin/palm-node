-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cor";

-- CreateTable
CREATE TABLE "cor"."system_health" (
    "id" SERIAL NOT NULL,
    "isHealth" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "system_health_pkey" PRIMARY KEY ("id")
);
