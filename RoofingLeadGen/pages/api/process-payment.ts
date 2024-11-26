import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { amount, cardNumber, expiryDate, cvv, paymentMethod } = req.body;

  try {
    // Create a PaymentMethod
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: parseInt(expiryDate.split('/')[0]),
        exp_year: parseInt(expiryDate.split('/')[1]),
        cvc: cvv,
      },
    });

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Stripe expects amount in cents
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: 'https://your-website.com/payment-success',
    });

    res.status(200).json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
}

