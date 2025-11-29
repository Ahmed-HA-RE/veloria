'use server';

import { auth } from '@/lib/auth';
import { SERVER_URL } from '@/lib/constants';
import {
  type RegisterUserForm,
  SignInUserForm,
  UpdateUserPassForm,
  UpdateUserPubInfoAdminForm,
  registerSchema,
  signInSchema,
  updateUserPassSchema,
  updateUserPubInfoAdminSchema,
  updateUserPubInfoSchema,
} from '@/schema/userSchema';
import { APIError, email, success } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Shipping, PaymentMethod } from '@/types';
import { shippingSchema } from '@/schema/checkoutSchema';
import { paymentMethodSchema } from '@/schema/checkoutSchema';
import { revalidatePath } from 'next/cache';
import { FileMetadata } from '../../app/hooks/use-file-upload';
import { UpdateUserPubInfo } from '@/types';
import cloudinary from '../../app/config/cloudinary';

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
    return { ...user, address: user.address as Shipping | null };
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
    }
    return { success: true, message: 'Address updated successfully' };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateUserPayment = async (paymentType: PaymentMethod) => {
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
    return { success: true, message: 'Payment method updated successfully' };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateUserPubInfo = async (
  data: UpdateUserPubInfo,
  image: File | FileMetadata | undefined
) => {
  try {
    let imageURL = '';

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) throw new Error('User not found');
    const validateData = updateUserPubInfoSchema.safeParse({
      name: data.name || user.name,
      email: data.email || user.email,
      bio: data.bio || user.bio,
    });

    if (!validateData.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    const updateData = {
      name: validateData.data.name,
      email: validateData.data.email,
      bio: validateData.data.bio === '' ? null : validateData.data.bio,
    };

    // convert image to unint8array and upload to file server then get the url
    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'avatars' }, function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          })
          .end(buffer);
      });

      imageURL = result.secure_url;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { ...updateData, image: imageURL },
    });

    revalidatePath('/', 'layout');

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateuserContactInfo = async (data: Shipping) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) throw new Error('User not found');

    const validateAddress = shippingSchema.safeParse(data);

    if (!validateAddress.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { address: validateAddress.data },
    });

    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Contact information updated successfully',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserPass = async (values: UpdateUserPassForm) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('Unauthorized');

    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });

    const loggedInWithCredential = accounts.filter(
      (account) => account.providerId === 'credential'
    );

    if (loggedInWithCredential.length === 0) {
      return {
        success: false,
        message: 'Cannot change password for OAuth accounts',
      };
    }

    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) throw new Error('User not found');

    const validateData = updateUserPassSchema.safeParse(values);

    if (!validateData.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    await auth.api.changePassword({
      body: {
        currentPassword: validateData.data.currentPassword,
        newPassword: validateData.data.newPassword,
      },
      headers: await headers(),
    });

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getAllUsersForAdmin = async (page: number, limit: number = 10) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('User is not authorized');

    const users = await auth.api.listUsers({
      query: {
        limit,
        offset: (page - 1) * limit,
      },
      headers: await headers(),
    });

    if (!users) throw new Error('No users found');

    const totalUsers = users.total;

    return {
      users: users.users,
      totalPages: Math.ceil(totalUsers / limit),
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteUserAsAdmin = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action');

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    // delete user avatar from cloudinary
    const publicId = user.image?.split('/').at(-1)?.split('.')[0];

    cloudinary.uploader.destroy(`avatars/${publicId}`);

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/admin/users', 'page');

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const banUserAsAdmin = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action');

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    await auth.api.banUser({
      body: {
        userId: id,
        banReason: 'Violation of terms of service',
      },
      headers: await headers(),
    });

    revalidatePath('/admin/users', 'page');

    return { success: true, message: 'User banned successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const unbanUserAsAdmin = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action');

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    await auth.api.unbanUser({
      body: {
        userId: id,
      },
      headers: await headers(),
    });

    revalidatePath('/admin/users', 'page');

    return { success: true, message: 'User unbanned successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserPublicInfoAsAdmin = async (
  id: string,
  data: UpdateUserPubInfoAdminForm,
  image: File | FileMetadata | undefined
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action');

    let imageURL = '';

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    const validatedData = updateUserPubInfoAdminSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    if (validatedData.data.role === 'admin' && !user.emailVerified)
      throw new Error('Cannot assign admin role to unverified email user');

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const result: string = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'avatars' }, function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve(result?.secure_url!);
          })
          .end(buffer);
      });
      imageURL = result;
    }

    await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          ...validatedData.data,
          image: imageURL || user.image,
        },
      },
      headers: await headers(),
    });

    revalidatePath('/admin/users', 'page');

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserContactInfoAsAdmin = async (
  id: string,
  data: Shipping
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action');

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    const validateAddress = shippingSchema.safeParse(data);

    if (!validateAddress.success) {
      return { success: false, message: 'Some fields are invalid' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { address: validateAddress.data },
    });

    revalidatePath('/admin/users', 'page');
    return {
      success: true,
      message: 'Contact information updated successfully',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
