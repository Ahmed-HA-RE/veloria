import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { Resend } from 'resend';
import VeloriaEmailVerification from '@/emails/VerifyEmail';
import VeloriaResetPassword from '@/emails/ResetPassword';
import { createAuthMiddleware } from 'better-auth/api';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/error' && ctx.method === 'GET' && ctx.query?.error) {
        return ctx.redirect('/');
      }
    }),
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 100,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Veloria <noreply@ahmedrehandev.net>',
        replyTo: process.env.REPLY_TO_GMAIL,
        to: user.email,
        subject: 'Reset Password',
        react: VeloriaResetPassword({
          userName: user.name,
          resetPasswordLink: url,
        }),
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60 * 1000,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },

  plugins: [
    nextCookies(),
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 min
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          const { error } = await resend.emails.send({
            from: 'Veloria <noreply@ahmedrehandev.net>',
            replyTo: process.env.REPLY_TO_GMAIL,
            to: email,
            subject: 'Email Verification',
            react: VeloriaEmailVerification({ otp }),
          });
          console.log(error);
        }
      },
    }),
  ],
});
