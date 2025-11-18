'use client';

import { cn, destructiveToast, successToast } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/app/components/ui/field';
import { Input } from '@/app/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa6';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type SignInUserForm, signInSchema } from '@/schema/userSchema';
import { useState } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '../ui/checkbox';
import { signInUser, singInSocials } from '@/app/actions/auth';

const SignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callbackUrl') || '/';

  const form = useForm<SignInUserForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: SignInUserForm) => {
    setIsPending(true);
    const result = await signInUser(values);

    if (result && !result.success && result.message) {
      destructiveToast(result.message);
      setIsPending(false);
      return;
    } else {
      setIsPending(false);
      successToast('Sign in successful! Redirecting...');
      setTimeout(() => router.push(callbackUrl), 1500);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    await singInSocials(provider, callbackUrl);
  };

  return (
    <section>
      {isPending && <ScreenSpinner mutate />}
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className='overflow-hidden p-0 shadow border-gray-300 dark:dark-border-color'>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-6'>
              <FieldGroup className='gap-4'>
                <div className='flex flex-col items-center w-full gap-2 '>
                  <h1 className='text-2xl font-bold'>Welcome back</h1>
                  <p className='text-sm text-center w-full'>
                    Sign in to your {APP_NAME} account{' '}
                  </p>
                </div>

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
                  <div className='flex flex-row justify-between items-center mt-2'>
                    {/* Remeber me  */}
                    <Controller
                      control={form.control}
                      name='rememberMe'
                      render={({ field, fieldState }) => (
                        <Field
                          orientation={'horizontal'}
                          className='gap-2'
                          data-invalid={fieldState.invalid}
                        >
                          <Checkbox
                            id='remember_me'
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            name={field.name}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                          {fieldState.invalid ? null : (
                            <label className='text-sm' htmlFor='remember_me'>
                              Remember me
                            </label>
                          )}
                        </Field>
                      )}
                    />
                    <Link
                      className='hover:underline hover:underline-offset-2 text-sm flex-1/2 '
                      href='/forgot-password'
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </Field>
                <Field>
                  <Button disabled={isPending} type='submit'>
                    Sign In
                  </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field className='grid grid-cols-2 gap-4'>
                  <Button
                    className="hover:bg-gray-100 border-black/50  [&_svg:not([class*='size-'])]:size-6"
                    variant='outline'
                    aria-label='Login with Github'
                    onClick={() => handleSocialSignIn('github')}
                    type='button'
                  >
                    <FaGithub className='text-black' aria-hidden='true' />
                  </Button>
                  <Button
                    className="hover:bg-[#DB4437]/90 border-black/50 hover:border-none [&_svg:not([class*='size-'])]:size-6"
                    variant='outline'
                    aria-label='Login with Google'
                    type='button'
                    onClick={() => handleSocialSignIn('google')}
                  >
                    <FcGoogle aria-hidden='true' />
                  </Button>
                </Field>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account?{' '}
                  <Link href='/register'>Register</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignInForm;
