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
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  } catch (error: unknown) {
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
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/signin');
};
