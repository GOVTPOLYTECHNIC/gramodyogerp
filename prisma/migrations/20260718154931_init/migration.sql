-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Institute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationYear" INTEGER NOT NULL,
    "totalSemester" INTEGER NOT NULL,
    "yearlyFee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_code_key" ON "public"."Institute"("code");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
