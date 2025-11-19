'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Field, FieldError, FieldLabel } from '../ui/field';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import { requestResetPassowrd } from '@/app/actions/auth';
import { destructiveToast, successToast } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const forgotPassSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
});

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPassSchema>>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: z.infer<typeof forgotPassSchema>) => {
    startTransition(async () => {
      const result = await requestResetPassowrd(data.email);

      if (!result?.success) {
        destructiveToast(result?.message);
        return;
      }

      successToast(result.message);
      setTimeout(() => router.push('/signin'), 2000);
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email */}
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='leading-5' htmlFor={field.name}>
                Email address
              </FieldLabel>
              <Input
                type='email'
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder='Enter your email address'
                className='focus-visible:border-blue-500 focus-visible:ring-blue-500'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button className='w-full' type='submit'>
          Send Reset Link
        </Button>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
