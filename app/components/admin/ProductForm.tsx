'use client';

import { useForm, Controller } from 'react-hook-form';
import { CreateProduct, Product } from '@/types';
import {
  createProductSchema,
  updateProductSchema,
} from '@/schema/productSchema';
import { successToast, destructiveToast, cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenSpinner from '../ScreenSpinner';
import { Field, FieldError, FieldLabel, FieldGroup } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import slugify from 'slugify';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { useRouter } from 'next/navigation';
import ProductDropzone from './ProductDropzone';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import BannerFileUpload from './BannerFileUpload';

type ProductFormProps = {
  type: 'create' | 'update';
  product?: Product;
};

const ProductForm = ({ type, product }: ProductFormProps) => {
  const router = useRouter();
  const [productsFiles, setProductsFiles] = useState<File[] | []>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<CreateProduct>({
    resolver: zodResolver(
      type === 'create' ? createProductSchema : updateProductSchema
    ),
    defaultValues:
      type === 'update'
        ? product
        : {
            name: '',
            slug: '',
            description: '',
            price: '0',
            category: '',
            stock: 0,
            isFeatured: false,
            brand: '',
          },
  });

  const onSubmit = async (data: CreateProduct) => {
    if (type === 'create') {
      const res = await createProduct(data, {
        productsImages: productsFiles,
        bannerImage: bannerFile,
      });
      if (!res.success) {
        destructiveToast(res.message);
        return;
      }
      successToast(res.message);
      router.push('/admin/products');
    }

    if (type === 'update') {
      if (!product?.id) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct(
        { ...data, id: product.id },
        { productsImages: productsFiles, bannerImage: bannerFile }
      );

      if (!res.success) {
        destructiveToast(res.message);
        return;
      }

      successToast(res.message);
      router.push('/admin/products');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {form.formState.isSubmitting && <ScreenSpinner mutate={true} />}
      <FieldGroup className='gap-4'>
        {/* Name + slug */}
        <FieldGroup className='md:flex-row'>
          {/* Name */}
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter product name'
                  className='auth-input'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Slug */}
          <Controller
            name='slug'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <div className='flex rounded-md shadow-xs'>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter product slug'
                    className='auth-input -me-px rounded-r-none shadow-none focus-visible:z-1'
                  />
                  <Button
                    type='button'
                    className='rounded-l-none'
                    onClick={() => {
                      const value = form.getValues('name');
                      form.setValue('slug', slugify(value, { lower: true }));
                    }}
                  >
                    Generate
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {/* Category + Brand */}
        <FieldGroup className='md:flex-row'>
          {/* Category */}
          <Controller
            name='category'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter product category'
                  className='auth-input'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Brand */}
          <Controller
            name='brand'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter product brand'
                  className='auth-input'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {/* Price + Stock */}
        <FieldGroup className='md:flex-row'>
          {/* Price */}
          <Controller
            name='price'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter product price'
                  className='auth-input'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Stock */}
          <Controller
            name='stock'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter product stock'
                  className='auth-input'
                  type='number'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Image */}
        <Field>
          <FieldLabel
            className={cn(
              'text-black',
              productsFiles.length === 0 &&
                type === 'create' &&
                'text-destructive'
            )}
          >
            Images
          </FieldLabel>
          <ProductDropzone
            setProductsFiles={setProductsFiles}
            previewImages={product?.images}
          />
          {form.formState.isSubmitted &&
            productsFiles.length === 0 &&
            type === 'create' && (
              <FieldError className='mt-2.5 text-destructive text-sm'>
                At least one image is required
              </FieldError>
            )}
        </Field>

        {/* Add banner only when is featured is checked */}
        {form.watch('isFeatured') && (
          <Field>
            <FieldLabel
              className={cn(
                'text-black',
                !bannerFile && !product?.banner && 'text-destructive'
              )}
            >
              Banner
            </FieldLabel>
            <BannerFileUpload
              setBannerFile={setBannerFile}
              preview={product?.banner}
            />
            {form.formState.isSubmitted &&
              !bannerFile &&
              !product?.banner &&
              form.watch('isFeatured') && (
                <FieldError className='mt-2.5 text-destructive text-sm'>
                  At least one image is required
                </FieldError>
              )}
          </Field>
        )}

        {/* Description */}
        <Controller
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder='Enter product description'
                className='auth-input h-32 resize-none'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* isFeatured */}
        <Controller
          name='isFeatured'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation={'horizontal'} data-invalid={fieldState.invalid}>
              <Checkbox
                id={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                }}
              />
              <FieldLabel htmlFor={field.name}>Is Featured</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          size={'lg'}
          type='submit'
          className='h-12 text-base mt-2'
          disabled={form.formState.isSubmitting}
        >
          {`${type === 'create' ? 'Create' : 'Update'} Product`}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ProductForm;
