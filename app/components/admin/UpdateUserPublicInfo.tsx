'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import {
  UpdateUserPubInfoAdminForm,
  updateUserPubInfoAdminSchema,
} from '../../../schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter } from '../ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';
import { destructiveToast, successToast } from '@/lib/utils';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';
import AvatarUpload from '../AvatarUpload';
import { FileMetadata } from '@/app/hooks/use-file-upload';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';
import { USERS_ROLES } from '@/lib/constants';
import { updateUserPublicInfoAsAdmin } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

type UpdateUserPublicInfoProps = {
  user: UpdateUserPubInfoAdminForm;
  userId: string;
};

const UpdateUserPublicInfo = ({ user, userId }: UpdateUserPublicInfoProps) => {
  const [file, setFile] = useState<File | FileMetadata | undefined>(undefined);

  const router = useRouter();

  const form = useForm<UpdateUserPubInfoAdminForm>({
    resolver: zodResolver(updateUserPubInfoAdminSchema),
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      role: user.role || 'user',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: UpdateUserPubInfoAdminForm) => {
    const result = await updateUserPublicInfoAsAdmin(userId, data, file);
    if (!result.success) {
      destructiveToast(result.message);
      return;
    }
    successToast(result.message);
    setTimeout(() => router.push('/admin/users'), 1500);
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

          {/* Role */}
          <Controller
            name='role'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <FieldContent>
                  <NativeSelect
                    aria-invalid={fieldState.invalid}
                    className='border-black/50 dark:dark-border-color focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                  >
                    {USERS_ROLES.map((role, index) => (
                      <NativeSelectOption key={index} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className='self-end'>
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className='size-6' />}
            {form.formState.isSubmitting
              ? 'Updating Profile...'
              : 'Update Profile'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UpdateUserPublicInfo;
