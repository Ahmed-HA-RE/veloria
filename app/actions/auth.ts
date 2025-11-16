'use server';

import { auth } from '@/lib/auth';
import { SERVER_URL } from '@/lib/constants';
import { type RegisterUserForm, registerSchema } from '@/schema/userSchema';

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
    return { success: false, message: error instanceof Error && error.message };
  }
};
