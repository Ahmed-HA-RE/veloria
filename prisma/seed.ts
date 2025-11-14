import { PrismaClient } from '@/lib/generated/prisma/client';
import sampleData from '@/sample-data';
const prisma = new PrismaClient();

const seed = async () => {
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: sampleData.products,
  });
};

seed();
