import axios from 'axios';
const PayPalUrl = process.env.PAYPAL_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async (price: number) => {
    const accessToken = await generateAccessToken();
    const response = await axios.post(
      `${PayPalUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  capturePayment: async (orderId: string) => {
    const accessToken = await generateAccessToken();
    const response = await axios.post(
      `${PayPalUrl}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  },
};

const generateAccessToken = async () => {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    'base64'
  );

  const res = await fetch(`${PayPalUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (res.ok) {
    const resData = await res.json();
    return resData.access_token;
  }
};
