import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const calendar = google.calendar({ version: 'v3', auth: new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/calendar'],
}) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { date, slot } = req.body;

  if (!date || !slot) {
    return res.status(400).json({ message: 'Date and slot are required' });
  }

  try {
    const startDateTime = new Date(`${date}T${slot}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    const event = {
      summary: 'Roofing Consultation',
      description: 'Consultation appointment for roofing services',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.status(200).json({ message: 'Appointment scheduled successfully', eventId: createdEvent.data.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while scheduling the appointment.' });
  }
}

