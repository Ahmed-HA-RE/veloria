'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { updateUserPubInfoSchema } from '../../../schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { destructiveToast, successToast } from '@/lib/utils';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';
import AvatarUpload from '../AvatarUpload';
import { FileMetadata } from '@/app/hooks/use-file-upload';
import { UpdateUserPubInfo } from '@/types';
import { updateUserPubInfo } from '@/app/actions/auth';
import { auth } from '@/lib/auth';

type UserPublicInfoFormProps = {
  user: typeof auth.$Infer.Session.user;
  providerId: string;
};

const UserPublicInfoForm = ({ user, providerId }: UserPublicInfoFormProps) => {
  const [file, setFile] = useState<File | FileMetadata | undefined>(undefined);

  const form = useForm<UpdateUserPubInfo>({
    resolver: zodResolver(updateUserPubInfoSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
    },
    mode: 'onSubmit',
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: UpdateUserPubInfo) => {
    startTransition(async () => {
      const result = await updateUserPubInfo(data, file);
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
            {/* Full Name */}
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Full Name</FieldLabel>
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
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type='email'
                    placeholder='Email Address'
                    aria-invalid={fieldState.invalid}
                    className='auth-input'
                    disabled={
                      providerId !== 'credential' || !user.emailVerified
                    }
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Bio */}
            <Controller
              control={form.control}
              name='bio'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center justify-between gap-1'>
                    <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                    <span className='text-muted-foreground text-xs'>
                      Optional field
                    </span>
                  </div>
                  <Textarea
                    placeholder='Public bio for your profile'
                    className='text-sm auth-input h-32'
                    id={field.name}
                    value={field.value || ''}
                    onChange={field.onChange}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {/* Avatar */}
          <div className='space-y-3'>
            <h2 className='font-medium'>Avatar</h2>
            <div className='flex flex-row items-center gap-4 '>
              {/* Upload btn */}
              <AvatarUpload
                setFile={setFile}
                defaultAvatar={user.image || undefined}
              />
            </div>
          </div>
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

export default UserPublicInfoForm;
