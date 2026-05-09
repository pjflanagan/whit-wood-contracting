import Link from "next/link";
import { Icon } from "../icon";
import { Event, getTimezonedDate } from "../../model";
import Style from "./style.module.scss";
import { stripHtml } from "string-strip-html";

type FormattedEvent = {
  description?: string;
  time: string;
  date: string;
  location: string;
  link?: string;
};

function formatEvent(event: Event): FormattedEvent {
  return {
    time: getTimezonedDate(event.start).format("h:mma"),
    date: getTimezonedDate(event.start).format("ddd, MMM D"),
    location: event.summary,
    description: stripHtml(event.description || '').result,
    link: event.location,
  };
}

type EventsListProps = {
  eventsList: Event[];
};

export function EventsList({ eventsList }: EventsListProps) {
  return (
    <div className={Style["events-list"]}>
      {eventsList.map((event, i) => {
        const formattedEvent = formatEvent(event);
        const eventElem = (
          <div key={i} className={Style["event"]}>
            <div className={Style["date-time"]}>
              <div className={Style["date"]}>{formattedEvent.date}</div>
              <div className={Style["time"]}>{formattedEvent.time}</div>
            </div>
            <div className={Style["event-location"]}>
              <div className={Style["location"]}>{formattedEvent.location}</div>
              <div className={Style["description"]}>{formattedEvent.description}</div>
            </div>
            {formattedEvent.link && (
              <div className={Style["link"]}>
                <div className={Style["link-button"]}>
                  <Icon name="open_in_new" />
                </div>
              </div>
            )}
          </div>
        );
        if (formattedEvent.link) {
          return (
            <Link key={i} href={formattedEvent.link} target="_blank" title={formattedEvent.location}>
              {eventElem}
            </Link>
          );
        }
        return eventElem;
      })}
    </div>
  );
}
