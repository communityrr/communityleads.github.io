import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { timestamp: 'asc' },
      take: 50, // Limit to last 50 messages
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while fetching chat messages.' });
  }
}

