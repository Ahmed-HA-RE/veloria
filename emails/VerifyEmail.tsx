import { config } from 'dotenv';

config();

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Font,
  pixelBasedPreset,
} from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

interface VeloriaEmailVerificationProps {
  otp: string;
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_PROD_URL}/images`
    : '/static';

export const VeloriaEmailVerification = ({
  otp,
}: VeloriaEmailVerificationProps) => (
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
      <Body className='bg-white font-veloria mx-auto my-0'>
        <Preview>Confirm your email address</Preview>
        <Container className='mx-auto my-0 py-0 px-5'>
          <Section className='mt-8'>
            <Img
              src={`${baseUrl}/logo.png`}
              width='50'
              height='50'
              alt={`${APP_NAME}`}
              className='mx-auto'
            />
          </Section>

          <Heading className='text-[#1d1c1d] text-[26px] sm:text-3xl font-bold my-[30px] mb-0 mx-0 p-0 leading-[42px]'>
            Confirm your email address
          </Heading>

          <Text className='text-lg mb-7.5'>
            Your confirmation code is below - enter it in your open browser
            window and we&apos;ll help you to get your email verified.
          </Text>

          <Section className='bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]'>
            <Text className='text-3xl leading-[24px] text-center align-middle'>
              {otp}
            </Text>
          </Section>

          <Text className='text-black text-sm leading-6'>
            If you didn&apos;t request this email, there&apos;s nothing to worry
            about, you can safely ignore it.
          </Text>

          <Section>
            <Row className='mb-8 pl-2 pr-2'>
              <Column className=''>
                <Img
                  src={`${baseUrl}/logo.png`}
                  width='40'
                  height='40'
                  alt={`${APP_NAME}`}
                />
              </Column>
              <Column className='' align='right'>
                <Link href='https://www.linkedin.com/'>
                  <Img
                    src={`${baseUrl}/linkedin_logo.png`}
                    width='32'
                    height='32'
                    alt='Linkedin'
                    className='inline ml-2'
                  />
                </Link>
                <Link href='https://www.facebook.com'>
                  <Img
                    src={`${baseUrl}/facebook_logo.png`}
                    width='32'
                    height='32'
                    alt='Facebook'
                    className='inline ml-2'
                  />
                </Link>
                <Link href='https://www.instagram.com'>
                  <Img
                    src={`${baseUrl}/instagram_logo.png`}
                    width='32'
                    height='32'
                    alt='Instgram'
                    className='inline ml-2'
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          <Section>
            <Link
              className='text-[#b7b7b7] underline'
              href={`${process.env.NEXT_PUBLIC_PROD_URL}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Home
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className='text-[#b7b7b7] underline'
              href={`${process.env.NEXT_PUBLIC_PROD_URL}/products`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Products
            </Link>
            <Text className='text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7]'>
              {`©2025 ${APP_NAME} Shop, LLC, Abu Dhabi, UAE`}
              <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default VeloriaEmailVerification;
