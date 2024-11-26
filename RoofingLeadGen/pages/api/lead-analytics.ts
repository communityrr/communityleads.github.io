import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { timeRange } = req.query;
  const endDate = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case '7days':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(endDate.getDate() - 90);
      break;
    default:
      return res.status(400).json({ message: 'Invalid time range' });
  }

  try {
    const analyticsData = await prisma.$queryRaw`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as newLeads,
        AVG(engagement_score) * 
100 as engagementRate,
        SUM(CASE WHEN status = 'CONVERTED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as conversionRate
      FROM leads
      WHERE created_at BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `;

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while fetching lead analytics.' });
  }
}

