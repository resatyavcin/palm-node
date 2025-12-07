-- CreateEnum
CREATE TYPE "cor"."MessageType" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "cor"."messages" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "type" "cor"."MessageType" NOT NULL,
    "tr" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "friendlyMessage" TEXT,
    "description" TEXT,
    "isBusinessError" BOOLEAN NOT NULL DEFAULT false,
    "statusCode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_key_key" ON "cor"."messages"("key");
