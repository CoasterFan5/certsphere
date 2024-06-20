-- AlterTable
ALTER TABLE "user" ADD COLUMN     "permissionGroupId" INTEGER;

-- CreateTable
CREATE TABLE "permissionGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "manageGroups" BOOLEAN NOT NULL,
    "manageCertifications" BOOLEAN NOT NULL,
    "manageMembers" BOOLEAN NOT NULL,

    CONSTRAINT "permissionGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_permissionGroupId_fkey" FOREIGN KEY ("permissionGroupId") REFERENCES "permissionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
