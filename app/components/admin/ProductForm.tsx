'use client';

import { useForm, Controller } from 'react-hook-form';
import { CreateProduct, Product } from '@/types';
import {
  createProductSchema,
  updateProductSchema,
} from '@/schema/productSchema';
import { successToast, destructiveToast } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenSpinner from '../ScreenSpinner';
import { Field, FieldError, FieldLabel, FieldGroup } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import slugify from 'slugify';
import { createProduct, updateProduct } from '@/app/actions/products';
import { useRouter } from 'next/navigation';
import ProductDropzone from './ProductDropzone';
import { Label } from '../ui/label';
import { useState } from 'react';

type ProductFormProps = {
  type: 'create' | 'update';
  product?: Product;
};

const ProductForm = ({ type, product }: ProductFormProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

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
            // isFeatured: false,
            // banner: null,
            brand: '',
          },
  });

  const onSubmit = async (data: CreateProduct) => {
    if (type === 'create') {
      const res = await createProduct(data, files);
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

      const res = await updateProduct({ ...data, id: product.id }, files);

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
      <FieldGroup>
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
        <div>
          <Label className='mb-4'>Images</Label>
          <ProductDropzone setFiles={setFiles} />
          {form.formState.isSubmitted && files.length === 0 && (
            <p className='mt-2.5 text-destructive text-sm'>
              At least one image is required
            </p>
          )}
        </div>

        {/* isFeatured */}

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
        <Button
          size={'lg'}
          type='submit'
          className='h-12 text-base'
          disabled={form.formState.isSubmitting}
        >
          {`${type === 'create' ? 'Create' : 'Update'} Product`}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ProductForm;
