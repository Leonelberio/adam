-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "categoryId" TEXT NOT NULL DEFAULT 'DEFAULT_CATEGORY_ID';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


INSERT INTO "Category" (id, name) VALUES ('DEFAULT_CATEGORY_ID', 'Autre');
