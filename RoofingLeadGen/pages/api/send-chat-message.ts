import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const newMessage = await prisma.chatMessage.create({
      data: {
        content,
        sender: 'user', // In a real app, this would be the authenticated user's ID
        timestamp: new Date(),
      },
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while sending the message.' });
  }
}

