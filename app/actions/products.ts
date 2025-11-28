'use server';
import { LIMIT_LIST_PRODUCTS } from '@/lib/constants';
import prisma from '@/lib/prisma';
import {
  createProductSchema,
  updateProductSchema,
} from '@/schema/productSchema';
import { CreateProduct, UpdateProduct } from '@/types';
import { revalidatePath } from 'next/cache';
import cloudinary from '../config/cloudinary';

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: LIMIT_LIST_PRODUCTS,
  });
  return data.map((product) => ({
    ...product,
    price: product.price,
    rating: product.rating,
  }));
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug },
  });

  return product;
};

type getAllProductsPrams = {
  page: number;
  query: string;
  category: string;
  limit?: number;
};

export const getAllProducts = async ({
  page,
  query,
  category,
  limit = 10,
}: getAllProductsPrams) => {
  try {
    const products = await prisma.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    if (!products) throw new Error('Products not found');

    const totalProducts = await prisma.product.count();

    return {
      products,
      totalPages: Math.ceil(totalProducts / limit),
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteProductById = async (id: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) throw new Error('Product not found');

    const imagesPaths = product.images.map(
      (image) => image.split('/').at(-1)?.split('.')[0]
    );

    for (const publicId of imagesPaths) {
      await cloudinary.uploader.destroy(`bayro/${publicId}`);
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products', 'page');

    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const createProduct = async (data: CreateProduct, images: File[]) => {
  try {
    let imagesURL: string[] = [];

    if (images.length === 0) throw new Error('At least one image is required');

    const validateProduct = createProductSchema.safeParse(data);

    if (!validateProduct.success) {
      throw new Error('Invalid product data');
    }

    for (const file of images) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const image: string = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'bayro', overwrite: true },
            function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              resolve(result?.secure_url as string);
            }
          )
          .end(buffer);
      });
      imagesURL.push(image);
    }

    await prisma.product.create({
      data: {
        ...validateProduct.data,
        images: imagesURL,
      },
    });

    revalidatePath('/admin/products', 'page');

    return { success: true, message: 'Product created successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateProduct = async (data: UpdateProduct, images: File[]) => {
  try {
    const validateProduct = updateProductSchema.safeParse(data);

    if (!validateProduct.success) {
      throw new Error('Invalid product data');
    }

    const product = await prisma.product.findFirst({
      where: { id: validateProduct.data.id },
    });

    if (!product) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: validateProduct.data.id },
      data: validateProduct.data,
    });

    revalidatePath('/admin/products', 'page');

    return { success: true, message: 'Product updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
