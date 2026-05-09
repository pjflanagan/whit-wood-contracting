
import moment, { Moment } from "moment-timezone";

type TimezonedDatetime = {
  dateTime: string;
  timeZone: string;
}

export type Event = {
  start: TimezonedDatetime;
  end: TimezonedDatetime;
  summary: string; // title (should be location)
  description: string;
  location: string; // link to event
}

export function getTimezonedDate(timezonedDatetime: TimezonedDatetime): Moment {
  return moment(timezonedDatetime.dateTime).tz(timezonedDatetime.timeZone);
}

function chronological(a: Event, b: Event): number {
  return getTimezonedDate(a.end).diff(getTimezonedDate(b.end));
}

// this function is run on a server in the eastern timezone (same as the Google Calendar)
// so we don't apply the timezone when filtering, we just use the absolute time
function eventEndsAfterTime(time: Moment): (event: Event) => boolean {
  return (event: Event) => {
    const eventEndTime = moment(event.end.dateTime);
    return eventEndTime.isAfter(time);
  }
}

export function filterAndOrderDates(fullEventsList: Event[]): Event[] {
  const eventEndsAfterCurrentTime = eventEndsAfterTime(moment());
  return fullEventsList
    .filter(eventEndsAfterCurrentTime)
    .sort(chronological);
}
