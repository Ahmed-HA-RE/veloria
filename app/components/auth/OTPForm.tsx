'use client';

import { destructiveToast, successToast } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/app/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/app/components/ui/input-otp';
import { useState } from 'react';
import { sendEmailVerificationOTP, verifyEmail } from '@/app/actions/auth';
import { auth } from '@/lib/auth';
import ScreenSpinner from '../ScreenSpinner';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const otpSchema = z.object({
  otp: z.string().min(6, 'Please enter all OTP digits'),
});

const OTPForm = ({ session }: { session: typeof auth.$Infer.Session }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSendEmailVerification = async () => {
    setIsPending(true);
    const result = await sendEmailVerificationOTP(session.user.email);
    if (result?.success) {
      setIsPending(false);
      successToast(result.message);
    } else {
      destructiveToast(result?.message);
      setIsPending(false);
      return;
    }
  };

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'all',
  });

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsPending(true);
    const result = await verifyEmail(session.user.email, data.otp);
    if (result?.success) {
      setIsPending(false);
      successToast(result.message);
      setTimeout(() => router.push('/'), 2000);
    } else {
      destructiveToast(result?.message);
      setIsPending(false);
      return;
    }
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
      <div className='flex flex-col gap-6'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h1 className='text-2xl font-bold'>Enter verification code</h1>
              <p className='text-muted-foreground text-sm text-balance'>
                We sent a 6-digit code to your email.
              </p>
            </div>
            <Controller
              name='otp'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className='sr-only'>
                    Verification code
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  >
                    <InputOTPGroup className='gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border '>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className='gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className='gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid ? (
                    <FieldError
                      className='text-center'
                      errors={[fieldState.error]}
                    />
                  ) : (
                    <FieldDescription className='text-center'>
                      Enter the 6-digit code sent to your email.
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
            <Button type='submit'>Verify</Button>
            <FieldDescription className='text-center'>
              Didn&apos;t receive the code?{' '}
              <span
                className='text-blue-500 hover:underline cursor-pointer decoration-1'
                onClick={handleSendEmailVerification}
              >
                Resend
              </span>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </>
  );
};
export default OTPForm;
