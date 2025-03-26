-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "problemId" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "outputText" TEXT NOT NULL,
    "explanation" TEXT,
    "img" TEXT
);

-- CreateTable
CREATE TABLE "TestCases" (
    "id" SERIAL NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Problem" (
    "problemNumber" TEXT,
    "problemId" TEXT NOT NULL,
    "problemTitle" TEXT NOT NULL,
    "inputText1" TEXT NOT NULL,
    "inputText2" TEXT NOT NULL,
    "inputText3" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "likesCount" INTEGER NOT NULL,
    "dislikeCount" INTEGER NOT NULL,
    "handlerFunc" TEXT NOT NULL,
    "starterFunction" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PdfBook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bookFrontImgSrc" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionDocument" (
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionDocument_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "category" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "solution" TEXT,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Example_id_key" ON "Example"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TestCases_id_key" ON "TestCases"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problemId_key" ON "Problem"("problemId");

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "QuestionDocument"("documentId") ON DELETE CASCADE ON UPDATE CASCADE;
