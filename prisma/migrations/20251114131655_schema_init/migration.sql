-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "brand" TEXT NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "numReviews" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "banner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_slug" ON "Product"("slug");
