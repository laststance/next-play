/*
  Warnings:

  - You are about to drop the column `name` on the `GuestNote` table. All the data in the column will be lost.
  - Added the required column `guest` to the `GuestNote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuestNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guest" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GuestNote" ("createdAt", "id", "message") SELECT "createdAt", "id", "message" FROM "GuestNote";
DROP TABLE "GuestNote";
ALTER TABLE "new_GuestNote" RENAME TO "GuestNote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
