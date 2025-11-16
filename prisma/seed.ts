import prisma from '@/lib/prisma';
import sampleData from '@/sample-data';

const seed = async () => {
  await prisma.product.deleteMany({});
  await prisma.product.createMany({ data: sampleData.products });
};

seed();
