import { config } from 'dotenv';

config();

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Font,
  pixelBasedPreset,
  Link,
} from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

interface VeloriaResetPasswordProps {
  userName: string;
  resetPasswordLink: string;
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
    : '/static';

const VeloriaResetPassword = ({
  userName,
  resetPasswordLink,
}: VeloriaResetPasswordProps) => {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily='Roboto'
            fallbackFontFamily='Verdana'
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={'normal, bold'}
            fontStyle='normal'
          />
        </Head>
        <Body className='bg-[#f6f9fc] py-2.5'>
          <Preview>{`${APP_NAME} reset your password`}</Preview>
          <Container className='bg-white border border-solid border-[#f0f0f0] p-[45px]'>
            <Img
              src={`${baseUrl}/logo.png`}
              width='50'
              height='50'
              alt={`${APP_NAME}`}
              className='mb-2'
            />
            <Section>
              <Text className='text-xl font-bold text-[#404040] leading-[26px]'>
                Greeting {userName},
              </Text>
              <Text className='text-base font-dropbox font-light text-[#404040] leading-[26px]'>
                Someone recently requested a password change for your {APP_NAME}
                account. If this was you, you can set a new password here:
              </Text>
              <Link
                className='bg-yellow-500 rounded text-white text-[15px] no-underline text-center font-dropbox-sans block w-[210px] py-[14px] px-[7px] cursor-pointer'
                href={resetPasswordLink}
              >
                Reset password
              </Link>
              <Text className='text-base font-dropbox font-light text-[#404040] leading-[26px]'>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text className='text-base font-dropbox font-light text-[#404040] leading-[26px]'>
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text className='text-base font-bold  text-[#404040] leading-[26px]'>
                Enjoy Shopping at {APP_NAME}!
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default VeloriaResetPassword;
