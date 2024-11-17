-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('Masculino', 'Femenino');

-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('postAdopcion', 'postSeBusca');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "lastName" VARCHAR,
    "celulares" JSONB,
    "email" VARCHAR,
    "direccion" VARCHAR,
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
    "foto" VARCHAR NOT NULL,
    "userId" INTEGER NOT NULL,
    "celulares" JSONB,
    "email" VARCHAR,
    "direccion" VARCHAR,
    "ubicacion" JSONB,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PostAdopcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetPostAdopcion" (
    "id" SERIAL NOT NULL,
    "raza" VARCHAR,
    "descripcion" TEXT,
    "edad" VARCHAR,
    "sexo" "Sexo" NOT NULL,
    "foto" VARCHAR NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "postAdopcionId" INTEGER NOT NULL,

    CONSTRAINT "PetPostAdopcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostSeBusca" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "foto" VARCHAR NOT NULL,
    "recompensa" DECIMAL(9,2) NOT NULL,
    "userId" INTEGER NOT NULL,
    "celulares" JSONB,
    "email" VARCHAR,
    "direccion" VARCHAR,
    "ubicacion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PostSeBusca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "modelType" "ModelType" NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "modelType" "ModelType" NOT NULL,
    "modelId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shared" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "modelType" "ModelType" NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shared_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "PostAdopcion" ADD CONSTRAINT "PostAdopcion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetPostAdopcion" ADD CONSTRAINT "PetPostAdopcion_postAdopcionId_fkey" FOREIGN KEY ("postAdopcionId") REFERENCES "PostAdopcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSeBusca" ADD CONSTRAINT "PostSeBusca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared" ADD CONSTRAINT "Shared_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
