-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN "proofImage1" TEXT;
ALTER TABLE "JobApplication" ADD COLUMN "proofImage2" TEXT;
ALTER TABLE "JobApplication" ADD COLUMN "submissionNote" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "nim" TEXT,
    "prodi" TEXT,
    "kelas" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MAHASISWA',
    "totalHours" INTEGER NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isLibraryClear" BOOLEAN NOT NULL DEFAULT true,
    "isAdminClear" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("createdAt", "id", "kelas", "name", "nim", "password", "prodi", "role", "totalHours", "updatedAt", "username") SELECT "createdAt", "id", "kelas", "name", "nim", "password", "prodi", "role", "totalHours", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
