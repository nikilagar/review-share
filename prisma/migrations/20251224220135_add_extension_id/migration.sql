/*
  Warnings:

  - A unique constraint covering the columns `[extensionId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "extensionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_extensionId_key" ON "Product"("extensionId");
