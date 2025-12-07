/*
  Warnings:

  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "cor"."messages";

-- DropEnum
DROP TYPE "cor"."MessageType";

-- CreateTable
CREATE TABLE "cor"."success_messages" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "tr" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cor"."error_messages" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "tr" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "friendlyMessage" TEXT,
    "description" TEXT,
    "isBusinessError" BOOLEAN NOT NULL DEFAULT false,
    "statusCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "error_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "success_messages_key_key" ON "cor"."success_messages"("key");

-- CreateIndex
CREATE UNIQUE INDEX "error_messages_key_key" ON "cor"."error_messages"("key");
