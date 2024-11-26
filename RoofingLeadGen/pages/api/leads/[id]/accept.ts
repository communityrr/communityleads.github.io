import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const updatedLead = await prisma.lead.update({
      where: { id: String(id) },
      data: { status: 'ACCEPTED' },
    });
    res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while accepting the lead.' });
  }
}

