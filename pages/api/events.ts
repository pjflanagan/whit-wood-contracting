
import type { NextApiRequest, NextApiResponse } from 'next'

import { Event } from '../../model';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CALENDAR_ID = '8e350f17a74a7dbd84eb59af5b9c2e85e64dcd8e6c2d6ecf1dddff69b194a6ad@group.calendar.google.com';
const CALENDAR_EVENTS_ENDPOINT = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`;

type ResponseData = Event[];

export async function fetchGoogleCalendarEvents() {
  try {
    const response = await fetch(CALENDAR_EVENTS_ENDPOINT, {
      method: 'GET',
    });
    const responseData = await response.json();
    if (responseData.error) {
      throw responseData.error.message;
    }
    return responseData.items;
  } catch (e) {
    console.error('Error fetching Google Calendar API: ', e);
  }
  return [];
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const events = await fetchGoogleCalendarEvents();
  res.status(200).json(events);
}
