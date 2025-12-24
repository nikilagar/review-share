/*
  Warnings:

  - Made the column `extensionId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chromeStoreUrl" TEXT NOT NULL,
    "extensionId" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("chromeStoreUrl", "createdAt", "description", "extensionId", "iconUrl", "id", "name", "userId") SELECT "chromeStoreUrl", "createdAt", "description", "extensionId", "iconUrl", "id", "name", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_extensionId_key" ON "Product"("extensionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
