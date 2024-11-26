import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projectId, message } = req.body;

  if (!projectId || !message) {
    return res.status(400).json({ message: 'Project ID and message are required' });
  }

  // In a real application, you would get the customer ID from the authenticated user's session
  const customerId = 'example-customer-id';

  try {
    const newMessage = await prisma.message.create({
      data: {
        content: message,
        projectId: projectId,
        senderId: customerId,
        senderType: 'CUSTOMER',
      },
    });

    res.status(200).json({ message: 'Message sent successfully', messageId: newMessage.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while sending the message.' });
  }
}

