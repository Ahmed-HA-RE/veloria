'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenSpinner from './ScreenSpinner';
import { shippingSchema } from '@/schema/checkoutSchema';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Shipping } from '@/types';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from './ui/field';
import { Input } from './ui/input';
import { NativeSelect, NativeSelectOption } from './ui/native-select';
import { destructiveToast, UAECITIES } from '@/lib/utils';
import { PhoneInput } from './ui/phone-number-input';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { updateUserAddress } from '../actions/auth';

const ShippingAddressForm = ({ userAddress }: { userAddress: Shipping }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Shipping>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: userAddress?.fullName || '',
      city: userAddress?.city || '',
      phoneNumber: userAddress?.phoneNumber || '',
      streetAddress: userAddress?.streetAddress || '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: Shipping) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(data);

        if (res?.success) {
          router.push('/checkout/payment-method');
        }
      } catch (error: any) {
        destructiveToast(error.message);
      }
    });
  };

  return (
    <form className='mt-4' onSubmit={form.handleSubmit(onSubmit)}>
      {isPending && <ScreenSpinner mutate={true} />}
      <FieldSet>
        <FieldGroup className=''>
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
                      <NativeSelectOption key={city.value} value={city.value}>
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
          <Button
            size={'default'}
            className='self-start text-base h-10'
            type='submit'
          >
            Continue
            <ArrowRight />
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ShippingAddressForm;
