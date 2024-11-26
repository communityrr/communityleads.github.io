import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const calendar = google.calendar({ version: 'v3', auth: new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/calendar'],
}) });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const busySlots = events.data.items.map(event => ({
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    }));

    const availableSlots = generateAvailableSlots(startDate, busySlots);

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while fetching available slots.' });
  }
}

function generateAvailableSlots(date: Date, busySlots: { start: Date; end: Date }[]): string[] {
  const workingHours = { start: 9, end: 17 };
  const slotDuration = 60; // 60 minutes per slot
  const availableSlots = [];

  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

    const isSlotAvailable = !busySlots.some(busySlot => 
      (slotStart >= busySlot.start && slotStart < busySlot.end) ||
      (slotEnd > busySlot.start && slotEnd <= busySlot.end) ||
      (slotStart <= busySlot.start && slotEnd >= busySlot.end)
    );

    if (isSlotAvailable) {
      availableSlots.push(slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }

  return availableSlots;
}

