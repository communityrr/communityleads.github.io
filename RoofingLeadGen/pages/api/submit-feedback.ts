import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: 'Rating is required' });
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        rating: parseInt(rating),
        comment,
        // In a real app, you would associate this with a specific customer or project
        customerId: 'example-customer-id',
      },
    });

    res.status(200).json({ message: 'Feedback submitted successfully', feedbackId: feedback.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while submitting feedback.' });
  }
}

