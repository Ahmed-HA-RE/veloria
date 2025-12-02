'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useForm, Controller, SubmitErrorHandler } from 'react-hook-form';
import { createReviewSchema } from '@/schema/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Rating } from '../ui/star-rating';

const ProductReviewForm = () => {
  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: '',
      comment: '',
      rating: 1,
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: z.infer<typeof createReviewSchema>) => {
    console.log('Review Submitted:', data);
  };

  return (
    <Dialog>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            className='border-black/40 dark:border-white'
            variant='outline'
          >
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Rate This Product</DialogTitle>
          </DialogHeader>
          <form>
            <FieldGroup className='gap-4'>
              {/* Title */}
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      className='focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500'
                      placeholder='Enter title'
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Comment */}
              <Controller
                name='comment'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                    <Textarea
                      id={field.name}
                      className='resize-none focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500'
                      placeholder='Enter comment'
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Rating */}
              <Controller
                name='rating'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='text-sm font-medium'>Rating</div>
                    <Rating
                      id={field.name}
                      size={30}
                      precision={0.5}
                      variant={'yellow'}
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <DialogFooter className='sm:justify-end'>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button type='submit'>Submit</Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ProductReviewForm;
