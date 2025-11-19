'use client';

import { cn, destructiveToast, successToast } from '@/lib/utils';
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
import { type RegisterUserForm, registerSchema } from '@/schema/userSchema';
import { useState } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';
import { APIError } from 'better-auth';

const RegisterForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callbackUrl') || '/';

  const form = useForm<RegisterUserForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: RegisterUserForm) => {
    try {
      setIsPending(true);
      const result = await registerUser(values);
      successToast(result?.message);
      setTimeout(() => router.push(callbackUrl), 1500);
    } catch (error: any) {
      destructiveToast(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section>
      {isPending && <ScreenSpinner mutate />}
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className='overflow-hidden p-0 shadow border-gray-300 dark:dark-border-color'>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-6'>
              <FieldGroup>
                <div className='flex flex-col items-center w-full gap-2 '>
                  <h1 className='text-2xl font-bold'>Create your account</h1>
                  <p className='text-sm text-center w-full'>
                    Enter your credentials below to create your account
                  </p>
                </div>
                {/* Name */}
                <Controller
                  control={form.control}
                  name='name'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='name'>Name</FieldLabel>
                      <Input
                        id='name'
                        type='name'
                        placeholder='Full Name'
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
                {/* Email */}
                <Controller
                  control={form.control}
                  name='email'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='email'>Email</FieldLabel>
                      <Input
                        id='email'
                        type='email'
                        placeholder='m@example.com'
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

                <Field>
                  <Field className='grid grid-cols-2 gap-4'>
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
                </Field>
                <Field>
                  <Button disabled={isPending} type='submit'>
                    Create Account
                  </Button>
                </Field>
                <FieldDescription className='text-center'>
                  Already have an account? <Link href='/signin'>Sign In</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegisterForm;
