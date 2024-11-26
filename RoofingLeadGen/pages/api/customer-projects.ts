import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // In a real application, you would get the customer ID from the authenticated user's session
  const customerId = 'example-customer-id';

  try {
    const projects = await prisma.project.findMany({
      where: {
        customerId: customerId,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while fetching customer projects.' });
  }
}

