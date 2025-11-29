'use client';
import { useForm, Controller } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { destructiveToast, successToast } from '@/lib/utils';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { UpdateUserPassForm, updateUserPassSchema } from '@/schema/userSchema';
import { updateUserPass } from '@/lib/actions/auth';
import Link from 'next/link';

const UserChangePassForm = () => {
  const form = useForm<UpdateUserPassForm>({
    resolver: zodResolver(updateUserPassSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: UpdateUserPassForm) => {
    startTransition(async () => {
      const result = await updateUserPass(data);

      if (!result.success) {
        destructiveToast(result.message);
        return;
      }

      successToast(result.message);
      setTimeout(() => window.location.reload(), 1500);
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1/2 w-full'>
      <Card className='dark:dark-border-color gap-6'>
        <CardContent className='space-y-6'>
          <FieldGroup className='gap-6'>
            {/* Password */}
            <Controller
              control={form.control}
              name='currentPassword'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex flex-row items-center justify-between'>
                    <FieldLabel htmlFor={field.name}>
                      Current Password
                    </FieldLabel>
                    <Link
                      className='text-xs text-blue-400 underline'
                      href={'/forgot-password'}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id={field.name}
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
              name='newPassword'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <Input
                    id={field.name}
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
          </FieldGroup>
        </CardContent>
        <CardFooter className='self-end'>
          <Button disabled={isPending}>
            {isPending && <Spinner className='size-6' />}
            {isPending ? 'Updating Profile...' : 'Update Profile'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserChangePassForm;
