import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const insightData = processLeadData(leads);

    res.status(200).json(insightData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while fetching lead insights.' });
  }
}

function processLeadData(leads) {
  const dataByDate = {};

  leads.forEach(lead => {
    const date = lead.createdAt.toISOString().split('T')[0];
    if (!dataByDate[date]) {
      dataByDate[date] = { newLeads: 0, convertedLeads: 0 };
    }
    dataByDate[date].newLeads++;
    if (lead.status === 'CONVERTED') {
      dataByDate[date].convertedLeads++;
    }
  });

  return Object.entries(dataByDate).map(([date, data]) => ({
    date,
    newLeads: data.newLeads,
    convertedLeads: data.convertedLeads,
  }));
}

