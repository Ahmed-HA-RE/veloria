'use client';
import { useForm, Controller } from 'react-hook-form';
import { useTransition } from 'react';
import { updateProfileSchema, UpdateProfile } from '@/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';
import { UAECITIES } from '@/lib/utils';
import { PhoneInput } from '../ui/phone-number-input';
import { Button } from '../ui/button';
import { auth } from '@/lib/auth';

const ContactInfoForm = ({
  session,
}: {
  session: typeof auth.$Infer.Session;
}) => {
  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session.user.name || '',
      email: session.user.email || '',
      address: {
        city: '',
        phoneNumber: '',
        streetAddress: '',
      },
    },
    mode: 'onSubmit',
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: UpdateProfile) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1/2 w-full'>
      <Card className='dark:dark-border-color'>
        <CardContent>
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
              disabled={!session.user.emailVerified}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
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
            {/* City */}
            <Controller
              name='address.city'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>City</FieldLabel>

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
                      <NativeSelectOption key={city.value} value={city.value}>
                        {city.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Phone */}
            <Controller
              name='address.phoneNumber'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>

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
                </Field>
              )}
            />
            {/* Street Address */}
            <Controller
              name='address.streetAddress'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Address</FieldLabel>
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
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button>Update</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ContactInfoForm;
