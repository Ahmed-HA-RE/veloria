'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenSpinner from '../ScreenSpinner';
import { paymentMethodSchema } from '@/schema/checkoutSchema';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentMethod } from '@/types';
import { Field, FieldError, FieldLabel, FieldSet } from '../ui/field';
import { destructiveToast, successToast } from '@/lib/utils';
import { PAYMENT_METHODS } from '@/lib/constants';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { updateUserPayment } from '../../../lib/actions/auth';
import { RadioGroup, RadioGroupItem } from '../ui/motion-radio-group';

const PaymentMethodForm = ({ userPayment }: { userPayment: string | null }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethod: userPayment || '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: PaymentMethod) => {
    startTransition(async () => {
      try {
        const res = await updateUserPayment(data);

        if (res.success) {
          successToast(res.message);
          router.push('/checkout/place-order');
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
        {/* Payment Method */}
        <Controller
          name='paymentMethod'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='space-y-1'
              >
                {PAYMENT_METHODS.split(', ').map((method) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    key={method}
                    orientation={'horizontal'}
                  >
                    <RadioGroupItem value={method} id={method} />
                    <FieldLabel htmlFor={method} className='font-normal'>
                      {method}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        />
      </FieldSet>
      <Button
        size={'default'}
        className='self-start text-base h-10 mt-6'
        type='submit'
      >
        Continue
        <ArrowRight />
      </Button>
    </form>
  );
};

export default PaymentMethodForm;
