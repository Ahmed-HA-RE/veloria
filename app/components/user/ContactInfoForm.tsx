'use client';
import { useForm, Controller } from 'react-hook-form';
import { useTransition } from 'react';
import { shippingSchema } from '../../../schema/checkoutSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter } from '../ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';
import { destructiveToast, successToast, UAECITIES } from '@/lib/utils';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Shipping } from '@/types';
import { PhoneInput } from '../ui/phone-number-input';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';
import {
  updateUserAddress,
  updateUserContactInfoAsAdmin,
} from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

type UserContactFormProps = {
  address: Shipping;
  type?: 'admin';
  userId?: string;
};

const UserContactForm = ({ address, type, userId }: UserContactFormProps) => {
  const form = useForm<Shipping>({
    resolver: zodResolver(shippingSchema),
    defaultValues: address || '',
    mode: 'onSubmit',
  });

  const router = useRouter();

  const onSubmit = async (data: Shipping) => {
    if (type === 'admin') {
      const result = await updateUserContactInfoAsAdmin(userId!, data);

      if (!result.success) {
        destructiveToast(result.message);
        return;
      }
      successToast(result.message);
      setTimeout(() => router.push('/admin/users'), 1500);
    } else {
      const result = await updateUserAddress(data);

      if (!result.success) {
        destructiveToast(result.message);
        return;
      }
      successToast(result.message);
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1/2 w-full'>
      <Card className='dark:dark-border-color gap-6'>
        <CardContent className='space-y-6'>
          <FieldSet>
            <FieldGroup className='gap-6'>
              {/* Full Name */}
              <Controller
                name='fullName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder='Full Name'
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                        className='border-black/50 dark:dark-border-color focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              {/* City */}
              <Controller
                name='city'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                    <FieldContent>
                      <NativeSelect
                        aria-invalid={fieldState.invalid}
                        className='border-black/50 dark:dark-border-color focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                      >
                        <NativeSelectOption value=''>
                          Select City
                        </NativeSelectOption>
                        {UAECITIES.map((city) => (
                          <NativeSelectOption
                            key={city.value}
                            value={city.value}
                          >
                            {city.label}
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
              {/* Phone */}
              <Controller
                name='phoneNumber'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                    <FieldContent>
                      <PhoneInput
                        defaultCountry='AE'
                        countries={['AE']}
                        countryCallingCodeEditable={false}
                        limitMaxLength
                        international
                        placeholder='Phone Number'
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              {/* Street Address */}
              <Controller
                name='streetAddress'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder='Address'
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                        className='border-black/50 dark:dark-border-color focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
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

export default UserContactForm;
