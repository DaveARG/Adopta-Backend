-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('PostAdopcion', 'PostSeBusca');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "celulares" JSONB,
    "email" TEXT,
    "direccion" TEXT,
    "ubicacion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostAdopcion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fotoPrincipal" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "celulares" JSONB,
    "email" TEXT,
    "direccion" TEXT,
    "ubicacion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PostAdopcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostSeBusca" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fotoPrincipal" TEXT NOT NULL,
    "recompensa" DECIMAL(9,2) NOT NULL,
    "userId" INTEGER NOT NULL,
    "celulares" JSONB,
    "email" TEXT,
    "direccion" TEXT,
    "ubicacion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PostSeBusca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,
    "modelType" "ModelType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "PostAdopcion" ADD CONSTRAINT "PostAdopcion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSeBusca" ADD CONSTRAINT "PostSeBusca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "PostAdopcionPhotos" FOREIGN KEY ("modelId") REFERENCES "PostAdopcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "PostSeBuscaPhotos" FOREIGN KEY ("modelId") REFERENCES "PostSeBusca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
