import prisma from '@/lib/prisma';
import sampleData from '@/sample-data';

const seed = async () => {
  await prisma.product.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.user });
};

seed();
