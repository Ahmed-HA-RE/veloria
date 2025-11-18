'use client';

import { cn, destructiveToast } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/app/components/ui/field';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ResetPassword, resetPassSchema } from '@/schema/userSchema';
import { useState } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/authClient';

const ResetPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const token = useSearchParams().get('token');

  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
  });

  if (!token) {
    router.push('/verification?status=false');
    return;
  }

  const onSubmit = async (values: ResetPassword) => {
    setIsPending(true);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      destructiveToast(error.message);
      setIsPending(false);
      return;
    } else {
      setIsPending(false);
      router.push('/verification?status=true');
    }
  };

  return (
    <section>
      {isPending && <ScreenSpinner mutate />}
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className='overflow-hidden p-0 shadow border-gray-300 dark:dark-border-color'>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-6'>
              <FieldGroup className='gap-5'>
                <div className='flex flex-col w-full gap-2'>
                  <h1 className='text-2xl font-bold'>Reset Password</h1>
                  <p className='text-sm w-full'>
                    Please enter your current password and choose a new password
                    to update your account security.
                  </p>
                </div>

                <Field>
                  {/* Password */}
                  <Controller
                    control={form.control}
                    name='password'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='password'>Password</FieldLabel>
                        <Input
                          id='password'
                          type='password'
                          aria-invalid={fieldState.invalid}
                          className='auth-input'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* Confirm Password */}
                  <Controller
                    control={form.control}
                    name='confirmPassword'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='confrim_password'>
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id='confrim_password'
                          type='password'
                          aria-invalid={fieldState.invalid}
                          className='auth-input'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>
                <Field>
                  <Button disabled={isPending} type='submit'>
                    Create Account
                  </Button>
                </Field>
                <FieldDescription>
                  <Link
                    href='/signin'
                    className='group text-base mx-auto flex w-fit items-center gap-1'
                  >
                    <ChevronLeftIcon className='size-6 transition-transform duration-200 group-hover:-translate-x-0.5' />
                    <span>Back to login</span>
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
