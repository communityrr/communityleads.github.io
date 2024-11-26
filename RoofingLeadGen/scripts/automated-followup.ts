import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  // Configure your email service here
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendFollowUpEmail(lead) {
  const mailOptions = {
    from: '"Your Roofing Company" <info@yourroofingcompany.com>',
    to: lead.email,
    subject: 'Follow-up on Your Roofing Project',
    text: `Dear ${lead.name},\n\nWe hope this email finds you well. We wanted to follow up on your recent inquiry about our roofing services. If you have any questions or would like to schedule a consultation, please don't hesitate to reach out.\n\nBest regards,\nYour Roofing Company`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Follow-up email sent to ${lead.email}`);
  } catch (error) {
    console.error(`Error sending follow-up email to ${lead.email}:`, error);
  }
}

// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running automated follow-up job');

  try {
    // Find leads that haven't been followed up within the last 7 days
    const leadsToFollowUp = await prisma.lead.findMany({
      where: {
        status: 'PENDING',
        lastFollowUp: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    for (const lead of leadsToFollowUp) {
      await sendFollowUpEmail(lead);
      await prisma.lead.update({
        where: { id: lead.id },
        data: { lastFollowUp: new Date() },
      });
    }

    console.log(`Sent follow-up emails to ${leadsToFollowUp.length} leads`);
  } catch (error) {
    console.error('Error in automated follow-up job:', error);
  }
});

console.log('Automated follow-up system initialized');
