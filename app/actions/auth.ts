'use server';

import { auth } from '@/lib/auth';
import { SERVER_URL } from '@/lib/constants';
import {
  type RegisterUserForm,
  SignInUserForm,
  registerSchema,
  signInSchema,
} from '@/schema/userSchema';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Shipping, PaymentMethod } from '@/types';
import { shippingSchema } from '@/schema/checkoutSchema';
import { paymentMethodSchema } from '@/schema/checkoutSchema';

export const registerUser = async (values: RegisterUserForm) => {
  try {
    const results = registerSchema.safeParse(values);

    if (!results.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    const { name, email, password } = results.data;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: `${SERVER_URL}/verify-email`,
      },
    });

    return {
      success: true,
      message: 'Registration successful.',
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
  }
};

export const signInUser = async (values: SignInUserForm) => {
  try {
    const results = signInSchema.safeParse(values);

    if (!results.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    const { email, password, rememberMe } = results.data;

    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
    });

    return {
      success: true,
      message: 'Sign in successful! Redirecting...',
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { message: error.body?.message, success: false };
    }
  }
};

export const signOutUser = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  // reset the sessionCartId cookie
  (await cookies()).delete('sessionCartId');

  return result;
};

export const sendEmailVerificationOTP = async (email: string) => {
  try {
    const data = await auth.api.sendVerificationOTP({
      body: {
        email,
        type: 'email-verification',
      },
    });

    if (data.success) {
      return {
        success: data.success,
        message:
          'Verification email sent successfully. Please check your inbox.',
      };
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
  }
};

export const verifyEmail = async (email: string, otp: string) => {
  try {
    await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });

    return {
      success: true,
      message: 'Email verification completed!',
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
  }
};

export const requestResetPassowrd = async (email: string) => {
  try {
    const data = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: '/reset-password',
      },
    });

    return {
      success: data.status,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
  }
};

export const singInSocials = async (
  provider: 'google' | 'github',
  callbackURL: string
) => {
  const data = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: callbackURL,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateUserAddress = async (data: Shipping) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) throw new Error('User not found');

    const validatedAddress = shippingSchema.safeParse(data);

    if (validatedAddress.success) {
      await prisma.user.update({
        where: { id: user.id },
        data: { address: validatedAddress.data },
      });
      return { success: true, message: 'Address updated successfully' };
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateUserPayment = async (paymentType: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) throw new Error('User not found');

    const validatedPayment = paymentMethodSchema.safeParse(paymentType);

    if (!validatedPayment.success) throw new Error('Invalid payment method');

    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethod: validatedPayment.data.paymentMethod },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
